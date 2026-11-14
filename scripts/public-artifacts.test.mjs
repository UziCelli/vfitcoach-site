import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { unsafeArtifacts } from './public-artifacts.mjs';

test('bloqueia segredos, mapas e links em subpastas e aceita assets públicos', async () => {
  const root = await mkdtemp(join(tmpdir(), 'public-security-'));
  try {
    await mkdir(join(root, 'assets'));
    for (const path of ['index.html', 'assets/app.js', 'assets/logo.svg', 'assets/app.js.map', '.env.production', 'assets/clientes.sqlite3']) {
      await writeFile(join(root, path), 'sintetico');
    }
    await symlink(join(root, 'index.html'), join(root, 'assets/link'));
    assert.deepEqual((await unsafeArtifacts(root)).sort(), ['.env.production', 'assets/app.js.map', 'assets/clientes.sqlite3', 'assets/link']);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
