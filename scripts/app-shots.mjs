// Prints do app (src/app/*.png; gislane/src/app/ com --site=gislane) -> AVIF + WebP leves em <pubDir>/assets/img/app/. Rodado pelo "npm run build".
// Print novo: coloque o PNG em src/app/, rode "npm run build" e adicione na seção ===== APP ===== do index.html.
import { readdir, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { root, pubDir, isDefault } from './site.mjs';
import sharp from 'sharp';

const src = join(root, isDefault ? 'src/app' : 'gislane/src/app') + '/';
const out = join(pubDir, 'assets/img/app') + '/';
await mkdir(out, { recursive: true });
for (const file of (await readdir(src)).filter((f) => f.endsWith('.png'))) {
  const name = file.replace(/\.png$/, '');
  const img = sharp(`${src}${file}`);
  for (const w of [300, 600]) {
    await img.clone().resize(w).avif({ quality: 55 }).toFile(`${out}${name}-${w}.avif`);
    await img.clone().resize(w).webp({ quality: 80 }).toFile(`${out}${name}-${w}.webp`);
  }
}
console.log('prints do app ok');
