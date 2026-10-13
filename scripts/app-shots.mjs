// Prints do app (src/app/*.png) -> AVIF + WebP leves em public/assets/img/app/. Rodado pelo "npm run build".
// Print novo: coloque o PNG em src/app/, rode "npm run build" e adicione na seção ===== APP ===== do index.html.
import { readdir, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const src = fileURLToPath(new URL('../src/app/', import.meta.url));
const out = fileURLToPath(new URL('../public/assets/img/app/', import.meta.url));
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
