// shots-tests.mjs — screenshot ulang + 18 tes fungsional rebuild pasca-buka.
// Playwright-core (Chromium headless). Screenshot diambil dari state default
// dulu, baru interaksi diuji, supaya screenshot cocok dengan kode yang di-submit.
// Jalankan dari ~/workspace/makefun agar playwright-core ter-resolve:
//   node serve.ts --port 8129 &  (dari direktori rebuild)
//   cd ~/workspace/makefun && node 20261126-4bounty/national-statistics-site-20261126-rebuild/shots-tests.mjs
import { chromium } from 'playwright-core';

const BASE = 'http://127.0.0.1:8129';
const OUT = '/home/hatch/workspace/makefun/20261126-4bounty/national-statistics-site-20261126-rebuild/screenshots';

const external = [];
const errors = [];
const results = [];
function check(n, name, ok, extra = '') {
  results.push({ n, name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${String(n).padStart(2, '0')} ${name}${extra ? ' — ' + extra : ''}`);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push(String(e)));
page.on('request', (r) => { if (!r.url().startsWith(BASE)) external.push(r.url()); });

// --- Screenshot 1: overview, state default ---
await page.goto(BASE + '/#/', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.screenshot({ path: OUT + '/1-overview.png' });

// --- Screenshot 2: ekonomi ---
await page.goto(BASE + '/#/ekonomi', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
await page.screenshot({ path: OUT + '/2-ekonomi.png' });

// --- Screenshot 3: penduduk, ukuran phone ---
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(BASE + '/#/penduduk', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
await page.screenshot({ path: OUT + '/3-penduduk-phone.png' });

// --- Screenshot 4: kesehatan ---
await page.setViewportSize({ width: 1280, height: 800 });
await page.goto(BASE + '/#/kesehatan', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
await page.screenshot({ path: OUT + '/4-kesehatan.png' });

// --- 18 tes fungsional (halaman desktop segar) ---
await page.goto(BASE + '/#/', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);

let t = 0;
const h2 = await page.textContent('h2');
check(++t, 'overview h2 "Indonesia dalam angka"', h2.includes('Indonesia dalam angka'));

const cards = await page.locator('.card').count();
check(++t, '12 kartu indikator di ringkasan', cards === 12, `${cards} kartu`);

const svgOverview = await page.locator('#app svg').count();
check(++t, 'grafik SVG ada di overview', svgOverview >= 2, `${svgOverview} svg`);

await page.click('button[data-metric="gdp"]');
await page.waitForTimeout(150);
const trenGdp = await page.textContent('#tren');
check(++t, 'tombol metrik PDB ubah judul tren', trenGdp.includes('PDB nominal'));

await page.click('button[data-metric="percapita"]');
await page.waitForTimeout(150);
const trenPc = await page.textContent('#tren');
check(++t, 'tombol metrik per kapita ubah judul tren', trenPc.includes('PDB per kapita'));

const growthText = await page.textContent('#app');
check(++t, 'bar chart pertumbuhan PDB tampil (−2,07%)', growthText.includes('−2,07') || growthText.includes('-2,07'));

await page.goto(BASE + '/#/penduduk', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
const h2P = await page.textContent('h2');
const svgP = await page.locator('#app svg').count();
check(++t, 'route penduduk render + grafik garis', h2P.includes('Penduduk') && svgP >= 1, `${svgP} svg`);

const donut = await page.locator('#app svg').nth(1).count();
const legend = await page.textContent('.legend');
check(++t, 'donat struktur umur + legenda tampil', donut === 1 && legend.includes('15–64 tahun'));

await page.click('button[data-sort="alpha"]');
await page.waitForTimeout(150);
const firstAlpha = await page.locator('#app svg text').first().textContent().catch(() => '');
const appTextAlpha = await page.textContent('#app');
check(++t, 'sort provinsi abjad: Banten di atas', appTextAlpha.indexOf('Banten') < appTextAlpha.indexOf('Jawa Barat'));

await page.click('button[data-sort="size"]');
await page.waitForTimeout(150);
const appTextSize = await page.textContent('#app');
check(++t, 'sort provinsi terpadat: Jawa Barat di atas', appTextSize.indexOf('Jawa Barat') < appTextSize.indexOf('Banten'));

await page.goto(BASE + '/#/ekonomi', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
const h2E = await page.textContent('h2');
const select = await page.locator('#tahun').count();
check(++t, 'route ekonomi render + select tahun ada', h2E.includes('Ekonomi') && select === 1);

await page.selectOption('#tahun', '2020');
await page.waitForTimeout(200);
const sum2020 = await page.textContent('#ringkas-tahun');
check(++t, 'pilih tahun 2020: ringkasan PDB 1,06', sum2020.includes('1,06') && sum2020.includes('2020'));

await page.selectOption('#tahun', '2025');
await page.waitForTimeout(200);
const sum2025 = await page.textContent('#ringkas-tahun');
check(++t, 'kembali 2025: ringkasan PDB 1,45', sum2025.includes('1,45') && sum2025.includes('2025'));

const econText = await page.textContent('#app');
check(++t, 'bar chart sektor tampil (Industri pengolahan)', econText.includes('Industri pengolahan') && econText.includes('18,7'));

await page.goto(BASE + '/#/kesehatan', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
const h2K = await page.textContent('h2');
const svgK = await page.locator('#app svg').count();
check(++t, 'route kesehatan render + grafik harapan hidup', h2K.includes('Kesehatan') && svgK >= 1);

await page.goto(BASE + '/#/pendidikan', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
const h2D = await page.textContent('h2');
const eduText = await page.textContent('#app');
check(++t, 'route pendidikan render + bar lama sekolah', h2D.includes('Pendidikan') && eduText.includes('13,33'));

const activeNav = await page.locator('nav.main a[aria-current="page"]').textContent();
check(++t, 'nav aktif ikut route (Pendidikan)', activeNav.trim() === 'Pendidikan');

await page.goto(BASE + '/#/penduduk', { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
const rows = await page.locator('table.year-table tbody tr').count();
check(++t, 'tabel tahun penduduk 6 baris (2020–2025)', rows === 6, `${rows} baris`);

await browser.close();

const passed = results.filter((r) => r.ok).length;
console.log(`\nTES: ${passed}/${results.length} lulus`);
console.log(`REQUEST EKSTERNAL (di luar ${BASE}): ${external.length}${external.length ? ' — ' + external.join(', ') : ''}`);
console.log(`CONSOLE/PAGE ERROR: ${errors.length}${errors.length ? ' — ' + errors.join(' | ') : ''}`);
if (passed !== results.length || external.length > 0 || errors.length > 0) process.exit(1);
