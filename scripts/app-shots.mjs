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
  const coach = name.includes('coach');
  // telas do coach (computador): só o topo, em largura de tela cheia; telas de celular: tamanho de mockup
  const base = coach ? sharp(`${src}${file}`).extract({ left: 0, top: 0, width: 2880, height: 1500 }) : sharp(`${src}${file}`);
  const buf = await base.png().toBuffer();
  for (const w of coach ? [800, 1600] : [300, 600]) {
    const img = sharp(buf).resize(w);
    await img.clone().avif({ quality: 55 }).toFile(`${out}${name}-${w}.avif`);
    await img.clone().webp({ quality: 80 }).toFile(`${out}${name}-${w}.webp`);
  }
}
console.log('prints do app ok');
