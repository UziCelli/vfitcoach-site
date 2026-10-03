// Qual site os scripts atendem: padrão = VFITCOACH (public/). SITE=gislane (ou --site=gislane) = gislane/public/.
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const arg = process.argv.find((a) => a.startsWith('--site='));
export const site = process.env.SITE || (arg && arg.slice(7)) || 'vfit';
export const root = fileURLToPath(new URL('..', import.meta.url));
export const isDefault = site === 'vfit';
export const pubDir = join(root, isDefault ? 'public' : `${site}/public`);
export const host = { vfit: 'vfitcoachapp.com', gislane: 'gislanepersonaltrainer.com' }[site] ?? (() => { throw new Error(`SITE desconhecido: ${site}`); })();
