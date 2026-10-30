import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function load(file, imports, globals = {}) {
  const exports = {};
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(compiled, { exports, require(name) {
    assert.ok(Object.hasOwn(imports, name), `Unexpected import ${name}`);
    return imports[name];
  }, ...globals });
  return exports;
}

function transport(getBootstrap = async () => ({ data: { headerName: 'X-XSRF-TOKEN', token: 'masked-csrf' } })) {
  let client;
  const signals = [];
  const statuses = [];
  const timers = new Map();
  let nextTimer = 0;
  let subscriptions = 0;
  class Client {
    constructor(options) { Object.assign(this, options); client = this; }
    activate() { this.active = true; }
    async deactivate() { this.active = false; }
    subscribe(destination, receive) { assert.equal(destination, '/user/queue/notifications'); this.receive = receive; subscriptions++; }
  }
  const { connectRealtime } = load('src/base/realtime/connect-realtime.ts', {
    '@stomp/stompjs': { Client, ReconnectionTimeMode: { EXPONENTIAL: 1 } },
    '@/base/api': { axiosGet: getBootstrap, normalizeApiError: error => error },
  }, {
    window: { location: { origin: 'https://trip.test', protocol: 'https:' } }, URL,
    setTimeout: callback => { timers.set(++nextTimer, callback); return nextTimer; },
    clearTimeout: id => timers.delete(id),
  });
  let connected = 0;
  const stop = connectRealtime({ onSignal: event => signals.push(event), onStatus: value => statuses.push(value), onConnected: () => connected++ });
  return { client, signals, statuses, timers, stop, connected: () => connected, subscriptions: () => subscriptions };
}

test('CSRF bootstrap prepares STOMP headers, HTTPS chooses WSS and reconnect subscribes again', async () => {
  const t = transport();
  await t.client.beforeConnect();
  assert.equal(t.client.brokerURL, 'wss://trip.test/realtime');
  assert.equal(t.client.connectHeaders['X-XSRF-TOKEN'], 'masked-csrf');
  t.client.onConnect(); t.client.onConnect();
  assert.equal(t.subscriptions(), 2); assert.equal(t.connected(), 2);
  t.stop(); assert.equal(t.client.active, false);
});

test('duplicate, malformed, unknown-version and unsupported events do not trigger duplicate UI changes', () => {
  const t = transport(); t.client.onConnect();
  const receive = body => t.client.receive({ body: JSON.stringify(body) });
  const event = { schemaVersion: 1, eventId: 'event-1', type: 'notification.created' };
  receive(event); receive(event); receive({ ...event, eventId: 'event-2', schemaVersion: 2 });
  receive({ ...event, eventId: 'event-3', type: 'untrusted.event' });
  t.client.receive({ body: 'invalid json' }); receive(null);
  assert.equal(t.signals.length, 1);
  t.stop(); receive({ ...event, eventId: 'late-event' }); assert.equal(t.signals.length, 1);
});

test('transient bootstrap failure retries, rejected session does not loop and cleanup cancels retry', async () => {
  const transient = transport(async () => { throw { status: 502 }; });
  await transient.client.beforeConnect(); assert.equal(transient.timers.size, 1);
  transient.stop(); assert.equal(transient.timers.size, 0);
  const denied = transport(async () => { throw { status: 403 }; });
  await denied.client.beforeConnect(); assert.equal(denied.timers.size, 0); assert.equal(denied.client.active, false);
});

test('logout during bootstrap cannot install credentials or notify the next account', async () => {
  let finish;
  const t = transport(() => new Promise(resolve => { finish = resolve; }));
  const pending = t.client.beforeConnect(); t.stop();
  finish({ data: { headerName: 'X-XSRF-TOKEN', token: 'stale-user-token' } });
  await pending;
  assert.equal(t.client.connectHeaders, undefined);
  t.client.onConnect(); assert.equal(t.connected(), 0);
});

test('BFF allowlist rejects unexpected paths and only forwards supported notification actions', async () => {
  const forwarded = [];
  const route = load('src/app/api/notifications/[[...path]]/route.ts', {
    'next/server': { NextResponse: { json: (body, options) => ({ body, ...options }) } },
    '@/features/notification/api/forward.server': { forwardNotification: (...args) => { forwarded.push(args); return 'ok'; } },
  });
  const req = {};
  assert.equal(await route.GET(req, { params: Promise.resolve({ path: ['snapshot'] }) }), 'ok');
  assert.equal(await route.PATCH(req, { params: Promise.resolve({ path: ['abc123', 'read'] }) }), 'ok');
  for (const path of [['..', 'trip'], ['abc', 'read'], ['user', '123'], ['snapshot', 'extra']]) {
    assert.equal((await route.GET(req, { params: Promise.resolve({ path }) })).status, 404);
  }
  assert.equal(forwarded.length, 2);
});

test('CSRF bootstrap BFF relays both the existing cookie and separate Set-Cookie headers', async () => {
  let upstreamRequest;
  const appended = [];
  const cookies = { access_token: 'access-test', 'WS-XSRF-TOKEN': 'existing-csrf' };
  const route = load('src/app/api/realtime/bootstrap/route.ts', {
    axios: { get: async (url, options) => { upstreamRequest = { url, ...options }; return {
      data: { status: 200, data: { token: 'masked' } },
      headers: { 'set-cookie': ['WS-XSRF-TOKEN=new; Path=/; HttpOnly', 'OTHER=one; Expires=Wed, 01 Jan 2030 00:00:00 GMT'] },
    }; }, isAxiosError: () => false },
    'next/server': { NextResponse: { json: (body, options = {}) => ({ body, ...options, headers: { append: (...args) => appended.push(args) } }) } },
  }, { process: { env: { CORE_API_BASE_URL: 'http://core.test/api' } } });
  await route.GET({ cookies: { get: key => cookies[key] ? { value: cookies[key] } : undefined } });
  assert.equal(upstreamRequest.url, 'http://core.test/api/realtime/bootstrap');
  assert.equal(upstreamRequest.headers.Authorization, 'Bearer access-test');
  assert.equal(upstreamRequest.headers.Cookie, 'WS-XSRF-TOKEN=existing-csrf');
  assert.equal(appended.length, 2);
});
