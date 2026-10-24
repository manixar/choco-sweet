// Downloads every image/icon used by the app from Figma into public/assets.
// Run once on a machine with internet access:  npm run assets
import { readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { assets } = JSON.parse(await readFile(join(root, 'scripts/figma-assets.json'), 'utf8'));
const force = process.argv.includes('--force');

let ok = 0;
let skipped = 0;
const failed = [];

for (const [rel, url] of Object.entries(assets)) {
  const out = join(root, 'public/assets', rel);
  if (!force) {
    try {
      if ((await stat(out)).size > 0) { skipped++; continue; }
    } catch {}
  }
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length === 0) throw new Error('empty response');
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, buf);
    ok++;
    console.log(`✓ ${rel}`);
  } catch (err) {
    failed.push(rel);
    console.error(`✗ ${rel} — ${err.message}`);
  }
}

console.log(`\n${ok} downloaded, ${skipped} already present, ${failed.length} failed.`);
if (failed.length) {
  console.log('Figma asset links expire after ~7 days. If they expired, re-export these from Figma into public/assets with the same names.');
  process.exitCode = 1;
}
