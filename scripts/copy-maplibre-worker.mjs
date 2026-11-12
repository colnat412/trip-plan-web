// MapLibre 6 tải worker bằng URL; Turbopack không đóng gói được file này nên
// ta phục vụ nó tĩnh từ public/maplibre và gọi setWorkerUrl() ở client.
import { copyFileSync, mkdirSync } from 'node:fs';

const from = 'node_modules/maplibre-gl/dist';
const to = 'public/maplibre';
mkdirSync(to, { recursive: true });
for (const file of ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs']) {
  copyFileSync(`${from}/${file}`, `${to}/${file}`);
}
