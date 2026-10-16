import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

// Keep the existing brand artwork; mobile launchers apply their own outer shape.
const source = await readFile(new URL('../src/app/icon.svg', import.meta.url), 'utf8');
if (!source.includes(' rx="12"') || !source.includes('scale(0.833333)')) {
  throw new Error('Brand SVG changed: review the background and maskable safe area.');
}

const fullBleed = source.replace(' rx="12"', '');
// Center the mark inside the maskable safe circle (radius = 40% of icon width).
const maskable = fullBleed.replace('scale(0.833333)', 'scale(0.75)');
const outputs = [
  [fullBleed, 192, '../public/pwa/icon-192.png'],
  [fullBleed, 512, '../public/pwa/icon-512.png'],
  [maskable, 512, '../public/pwa/icon-maskable-512.png'],
  [fullBleed, 180, '../src/app/apple-icon.png'],
];

for (const [svg, size, path] of outputs) {
  await sharp(Buffer.from(svg), { density: 1024 })
    .resize(size, size)
    .removeAlpha()
    .png()
    .toFile(new URL(path, import.meta.url).pathname);
  console.log(`${size}×${size}: ${path}`);
}
