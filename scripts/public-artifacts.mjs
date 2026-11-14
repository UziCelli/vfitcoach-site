// Impede que arquivos internos sejam publicados como assets, inclusive em subpastas.
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

export async function unsafeArtifacts(root, prefix = '') {
  const problems = [];
  for (const entry of await readdir(join(root, prefix), { withFileTypes: true })) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) {
      problems.push(path);
      continue;
    }
    if (/^(?:\.env(?:\..*)?|\.git|node_modules|sa\.json|service[-_]?account.*\.json|package(?:-lock)?\.json)$/i.test(entry.name)
        || /\.(?:map|pem|key|p12|pfx|db|sqlite3?|sql|bak)$/i.test(entry.name)) {
      problems.push(path);
    } else if (entry.isDirectory()) {
      problems.push(...await unsafeArtifacts(root, path));
    }
  }
  return problems;
}
