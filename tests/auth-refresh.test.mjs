import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import axios from 'axios';

// Run the actual interceptor module with isolated refresh transport and location.
function setup(refresh) {
  const redirects = [];
  const location = { pathname: '/overview', set href(value) { redirects.push(value); } };
  const exports = {};
  const source = ts.transpileModule(fs.readFileSync('src/base/api/axios-client.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(source, { exports, window: { location }, require(name) {
    if (name === 'axios') return { ...axios, create: axios.create, post: refresh };
    if (name === '../constants') return { API_URL: '/api', PUBLIC_PATHS: ['/share'] };
    throw Error(`Unexpected import ${name}`);
  }});
  return { client: exports.axiosClient, redirects };
}
const failure = (status, config = {}) => new axios.AxiosError('Request failed', undefined, config, undefined, {
  status, data: {}, headers: {}, config, statusText: 'Error',
});

test('refresh 500/network errors never navigate to login', async () => {
  for (const error of [failure(500), new axios.AxiosError('ECONNREFUSED')]) {
    const { client, redirects } = setup(async () => { throw error; });
    client.defaults.adapter = async config => { throw failure(401, config); };
    await assert.rejects(client.get('/auth/me'));
    assert.equal(redirects.length, 0);
  }
});

test('rejected session navigates to login once', async () => {
  const { client, redirects } = setup(async () => { throw failure(401); });
  client.defaults.adapter = async config => { throw failure(401, config); };
  await assert.rejects(client.get('/auth/me'));
  await assert.rejects(client.get('/trip/my-trips'));
  assert.deepEqual(redirects, ['/login']);
});

test('concurrent 401 requests share refresh and each retry only once', async () => {
  let refreshes = 0;
  const attempts = {};
  const { client, redirects } = setup(async () => {
    refreshes++;
    await new Promise(resolve => setTimeout(resolve, 10));
    return { data: {} };
  });
  client.defaults.adapter = async config => {
    attempts[config.url] = (attempts[config.url] || 0) + 1;
    throw failure(401, config);
  };
  const results = await Promise.allSettled([client.get('/auth/me'), client.get('/trip/my-trips')]);
  assert.ok(results.every(result => result.status === 'rejected'));
  assert.equal(refreshes, 1);
  assert.deepEqual(attempts, { '/auth/me': 2, '/trip/my-trips': 2 });
  assert.equal(redirects.length, 0);
});
