// main.ts — program penyerahan situs statistik nasional (Node 22, stdlib only).
// Ditulis ulang untuk rebuild pasca-buka. Menyalin app/ dan screenshots/ ke
// /output (atau MAKEFUN_OUTPUT_DIR) lalu menulis /output/dossier.json dengan
// buildDossier dari vendor/makefun-frontend.ts. Sebelum menyalin, validasi file
// wajib ada dan cetak ringkasan ke stdout agar dua run bisa dibandingkan.
import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Validasi: file wajib ada sebelum buildDossier dipanggil.
const required = ['app/index.html', 'app/style.css', 'app/main.js', 'app/data.js', 'app/charts.js'];
for (const rel of required) {
  if (!existsSync(join(here, rel))) throw new Error('missing required file: ' + rel);
}

function collect(dir, acc = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) collect(p, acc);
    else if (entry.isFile()) acc.push(p);
  }
  return acc;
}

function summarize(dir) {
  const files = collect(dir);
  return { files: files.length, bytes: files.reduce((s, f) => s + statSync(f).size, 0) };
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

const appSummary = summarize(join(out, 'app'));
const shotSummary = summarize(join(out, 'screenshots'));
const shotNames = readdirSync(join(out, 'screenshots')).sort();
if (shotNames.length < 3 || shotNames.length > 4) {
  throw new Error(`screenshots/ must hold 3 or 4 images, found ${shotNames.length}`);
}

writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

const dossierBytes = statSync(join(out, 'dossier.json')).size;
console.log(`Statistik Indonesia 2026 — 12 Indikator v1`);
console.log(`app/: ${appSummary.files} files, ${appSummary.bytes} bytes`);
console.log(`screenshots/: ${shotSummary.files} files (${shotNames.join(', ')}), ${shotSummary.bytes} bytes`);
console.log(`dossier.json: ${dossierBytes} bytes -> ${join(out, 'dossier.json')}`);
