// main.js — router hash + render tiap seksi + semua kontrol interaktif.
// Ditulis ulang untuk rebuild pasca-buka; semua angka berasal dari data.js.
import {
  COUNTRY, YEARS, POPULATION, GDP, GDP_GROWTH, GDP_PER_CAPITA,
  PROVINCES, AGE_GROUPS, UNEMPLOYMENT, LIFE_EXPECTANCY,
  KEY_INDICATORS, SECTORS,
} from "./data.js";
import { lineChart, barChart, donutChart, formatAngka } from "./charts.js";

const app = document.getElementById("app");
const navLinks = [...document.querySelectorAll("nav.main a")];

let overviewMetric = "population";
let provinceSort = "size";
let econYear = 2025;

function currentRoute() {
  return (location.hash || "#/").replace(/^#\/?/, "").split("/")[0];
}

function render() {
  const key = currentRoute();
  const page = PAGES[key] || PAGES[""];
  navLinks.forEach((a) => {
    const routeKey = a.getAttribute("href").replace(/^#\/?/, "");
    const active = routeKey === key;
    a.classList.toggle("active", active);
    a.setAttribute("aria-current", active ? "page" : "false");
  });
  page();
  window.scrollTo(0, 0);
}

const PAGES = {
  "": renderOverview,
  penduduk: renderPenduduk,
  ekonomi: renderEkonomi,
  kesehatan: renderKesehatan,
  pendidikan: renderPendidikan,
};

function cards(list) {
  const items = list.map((k) => `
    <article class="card">
      <div class="label">${k.label}</div>
      <div class="value">${k.value}</div>
      <div class="meta">${k.year} · ${k.source}</div>
      <div class="note">${k.note}</div>
    </article>`).join("");
  return `<div class="cards">${items}</div>`;
}

function yearTable(rows, unit) {
  const body = rows.map((d) => `<tr><td>${d.year}</td><td class="num">${formatAngka(d.value)}</td></tr>`).join("");
  return `<table class="data year-table"><thead><tr><th>Tahun</th><th class="num">Nilai (${unit})</th></tr></thead><tbody>${body}</tbody></table>`;
}

function sourceNote(text) {
  return `<p class="source-note">${text}</p>`;
}

// --- Ringkasan ---
function renderOverview() {
  const options = {
    population: { label: "Penduduk (juta jiwa)", data: POPULATION, unit: " jt", decimals: 1, color: "#1f6f8b" },
    gdp: { label: "PDB nominal (triliun US$)", data: GDP, unit: " T", decimals: 2, color: "#2a9d8f" },
    percapita: { label: "PDB per kapita (US$)", data: GDP_PER_CAPITA, unit: "", decimals: 0, color: "#b45309" },
  };
  const m = options[overviewMetric];
  app.innerHTML = `
    <h2>Indonesia dalam angka</h2>
    <p class="lede">Satu halaman untuk 12 indikator utama Indonesia — penduduk,
    ekonomi, ketenagakerjaan, kesehatan, dan pendidikan — dari World Bank dan
    BPS. Pilih seksi di menu atas untuk detail, grafik, dan tabel per tahun.</p>
    ${cards(KEY_INDICATORS)}
    <div class="panel">
      <h3 id="tren">Tren 2020–2025 — ${m.label}</h3>
      <div class="controls" role="group" aria-label="Pilih indikator tren">
        <button data-metric="population" aria-pressed="${overviewMetric === "population"}">Penduduk</button>
        <button data-metric="gdp" aria-pressed="${overviewMetric === "gdp"}">PDB</button>
        <button data-metric="percapita" aria-pressed="${overviewMetric === "percapita"}">PDB per kapita</button>
      </div>
      ${lineChart(m.data, { color: m.color, unit: m.unit, decimals: m.decimals })}
      ${sourceNote("Sumber: World Bank World Development Indicators, 2020–2025. Grafik digambar dari data di atas.")}
    </div>
    <div class="grid2">
      <div class="panel"><h3>Pertumbuhan PDB (%/tahun)</h3>
        ${barChart(GDP_GROWTH.map((d) => ({ label: String(d.year), value: d.value })), { color: "#2a9d8f", unit: "%", decimals: 2 })}
        ${sourceNote("Sumber: World Bank WDI. 2020 negatif (−2,07%) karena pandemi COVID-19.")}</div>
      <div class="panel"><h3>Sekilas negara</h3>
        <table class="data"><tbody>
          <tr><th>Ibu kota</th><td>${COUNTRY.capital}</td></tr>
          <tr><th>Luas daratan</th><td class="num">1.904.569 km²</td></tr>
          <tr><th>Provinsi</th><td class="num">38</td></tr>
          <tr><th>Peringkat penduduk dunia</th><td class="num">ke-4</td></tr>
          <tr><th>Peringkat PDB dunia</th><td class="num">ke-17 (2025)</td></tr>
          <tr><th>Kelompok pendapatan</th><td>Menengah atas (World Bank)</td></tr>
        </tbody></table>
        ${sourceNote("Sumber: World Bank WDI 2024–2025; BPS.")}</div>
    </div>
    <div class="callout"><strong>Mulai menjelajah:</strong>
      <a href="#/penduduk">Penduduk</a> · <a href="#/ekonomi">Ekonomi</a> ·
      <a href="#/kesehatan">Kesehatan</a> · <a href="#/pendidikan">Pendidikan</a> —
      tiap seksi punya grafik dan tabel sendiri.</div>`;
  app.querySelectorAll("[data-metric]").forEach((b) => {
    b.addEventListener("click", () => { overviewMetric = b.dataset.metric; renderOverview(); });
  });
}

// --- Penduduk ---
function renderPenduduk() {
  const sorted = [...PROVINCES].sort((a, b) =>
    provinceSort === "size" ? b.pop - a.pop : a.name.localeCompare(b.name, "id"));
  app.innerHTML = `
    <h2>Penduduk</h2>
    <p class="lede">285,7 juta jiwa pada 2025 (World Bank WDI) — negara ke-4
    terpadat di dunia. Pertumbuhan 0,8% per tahun; 58,8% tinggal di perkotaan.</p>
    <div class="grid2">
      <div class="panel"><h3>Penduduk 2020–2025 (juta jiwa)</h3>
        ${lineChart(POPULATION, { color: "#1f6f8b", unit: " jt" })}
        ${sourceNote("Sumber: World Bank WDI (SP.POP.TOTL).")}</div>
      <div class="panel"><h3>Struktur umur 2024</h3>
        <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          ${donutChart(AGE_GROUPS)}
          <ul class="legend">${AGE_GROUPS.map((g) => `<li><span class="swatch" style="background:${g.color}"></span>${g.label}: <strong>${formatAngka(g.value)}%</strong></li>`).join("")}</ul>
        </div>
        ${sourceNote("Sumber: World Bank WDI 2024. Usia produktif (15–64) 68,1% — bonus demografi.")}</div>
    </div>
    <div class="panel"><h3>Provinsi terpadat (juta jiwa, 2024)</h3>
      <div class="controls" role="group" aria-label="Urutkan provinsi">
        <button data-sort="size" aria-pressed="${provinceSort === "size"}">Terpadat dulu</button>
        <button data-sort="alpha" aria-pressed="${provinceSort === "alpha"}">Abjad A–Z</button>
      </div>
      ${barChart(sorted.map((p) => ({ label: p.name, value: p.pop })), { horizontal: true, color: "#1f6f8b", unit: " jt" })}
      ${sourceNote("Sumber: BPS, estimasi pertengahan 2024. Tiga provinsi di Jawa menampung lebih dari 130 juta jiwa.")}</div>
    ${yearTable(POPULATION, "juta jiwa")}`;
  app.querySelectorAll("[data-sort]").forEach((b) => {
    b.addEventListener("click", () => { provinceSort = b.dataset.sort; renderPenduduk(); });
  });
}

// --- Ekonomi ---
function renderEkonomi() {
  const y = econYear;
  const at = (series) => series.find((d) => d.year === y);
  app.innerHTML = `
    <h2>Ekonomi</h2>
    <p class="lede">PDB US$1,45 triliun pada 2025 (World Bank WDI), tumbuh 5,1%.
    Pilih tahun untuk melihat angka tahun itu; grafik menunjukkan tren 2020–2025.</p>
    <div class="controls"><label for="tahun">Tahun: </label>
      <select id="tahun">${YEARS.map((t) => `<option value="${t}" ${t === y ? "selected" : ""}>${t}</option>`).join("")}</select>
      <span id="ringkas-tahun"><strong>${y}:</strong> PDB US$${formatAngka(at(GDP).value, 2)} T ·
      per kapita US$${formatAngka(at(GDP_PER_CAPITA).value, 0)} ·
      tumbuh ${formatAngka(at(GDP_GROWTH).value, 2)}% ·
      pengangguran ${formatAngka(at(UNEMPLOYMENT).value, 2)}%</span>
    </div>
    <div class="grid2">
      <div class="panel"><h3>PDB nominal (triliun US$)</h3>
        ${lineChart(GDP, { color: "#2a9d8f", unit: " T", decimals: 2 })}
        ${sourceNote("Sumber: World Bank WDI (NY.GDP.MKTP.CD).")}</div>
      <div class="panel"><h3>Pertumbuhan PDB (%/tahun)</h3>
        ${barChart(GDP_GROWTH.map((d) => ({ label: String(d.year), value: d.value })), { color: "#2a9d8f", unit: "%", decimals: 2 })}
        ${sourceNote("Sumber: World Bank WDI. Rata-rata ~5% per tahun sejak 2022.")}</div>
    </div>
    <div class="grid2">
      <div class="panel"><h3>Pangsa sektor PDB 2024 (%)</h3>
        ${barChart(SECTORS.map((s) => ({ label: s.name, value: s.share })), { horizontal: true, color: "#b45309", unit: "%" })}
        ${sourceNote("Sumber: BPS 2024 (pembulatan). Industri pengolahan sektor terbesar.")}</div>
      <div class="panel"><h3>Perdagangan &amp; investasi 2024</h3>
        <table class="data"><tbody>
          <tr><th>Ekspor barang &amp; jasa</th><td class="num">22,2% PDB</td></tr>
          <tr><th>Impor barang &amp; jasa</th><td class="num">20,4% PDB</td></tr>
          <tr><th>FDI masuk</th><td class="num">US$24,2 miliar</td></tr>
          <tr><th>Nilai tukar rata-rata</th><td class="num">Rp15.855 / US$</td></tr>
          <tr><th>Inflasi (IHK)</th><td class="num">1,9% (2025); BPS 1,57% (2024)</td></tr>
        </tbody></table>
        ${sourceNote("Sumber: World Bank WDI 2024–2025; BPS.")}</div>
    </div>`;
  document.getElementById("tahun").addEventListener("change", (e) => {
    econYear = Number(e.target.value);
    renderEkonomi();
  });
}

// --- Kesehatan ---
function renderKesehatan() {
  app.innerHTML = `
    <h2>Kesehatan</h2>
    <p class="lede">Harapan hidup 71,3 tahun (2024, World Bank WDI); BPS mencatat
    73,93 tahun pada tahun yang sama — dua sumber, dua metode, keduanya dicantumkan.</p>
    <div class="grid2">
      <div class="panel"><h3>Harapan hidup saat lahir (tahun)</h3>
        ${lineChart(LIFE_EXPECTANCY, { color: "#1f6f8b", unit: " thn" })}
        ${sourceNote("Sumber: World Bank WDI (SP.DYN.LE00.IN). Turun 2021 (pandemi), pulih sejak 2022.")}</div>
      <div class="panel"><h3>Indikator kesehatan</h3>
        <table class="data"><tbody>
          <tr><th>Harapan hidup (WDI)</th><td class="num">71,3 tahun (2024)</td></tr>
          <tr><th>Harapan hidup (BPS)</th><td class="num">73,93 tahun (2024)</td></tr>
          <tr><th>Belanja kesehatan</th><td class="num">2,7% PDB (2023)</td></tr>
          <tr><th>Kematian ibu</th><td class="num">140 / 100.000 kelahiran (2023)</td></tr>
          <tr><th>Emisi CO₂ per kapita</th><td class="num">2,9 ton (2024)</td></tr>
        </tbody></table>
        ${sourceNote("Sumber: World Bank WDI 2023–2024; BPS 2024.")}</div>
    </div>
    <div class="callout"><strong>Yang perlu diperhatikan:</strong> belanja kesehatan
    2,7% PDB masih di bawah rata-rata dunia — angka yang penting saat membandingkan
    antarnegara, bukan sekadar melihat harapan hidup.</div>`;
}

// --- Pendidikan ---
function renderPendidikan() {
  app.innerHTML = `
    <h2>Pendidikan</h2>
    <p class="lede">IPM 75,02 (2024, BPS) — kategori tinggi. Rata-rata lama sekolah
    8,85 tahun; harapan lama sekolah 13,33 tahun.</p>
    <div class="grid2">
      <div class="panel"><h3>Lama sekolah (tahun, BPS 2024)</h3>
        ${barChart([
          { label: "Rata-rata", value: 8.85 },
          { label: "Harapan", value: 13.33 },
        ], { color: "#2a9d8f", unit: " thn", decimals: 2 })}
        ${sourceNote("Sumber: BPS 2024. Selisih keduanya menunjukkan anak kini bersekolah lebih lama daripada generasi sebelumnya.")}</div>
      <div class="panel"><h3>Indikator pendidikan</h3>
        <table class="data"><tbody>
          <tr><th>Indeks Pembangunan Manusia</th><td class="num">75,02 (2024)</td></tr>
          <tr><th>Partisipasi kasar SD</th><td class="num">100,37% (2025)</td></tr>
          <tr><th>Pengguna internet</th><td class="num">72,8% penduduk (2024)</td></tr>
          <tr><th>Angkatan kerja</th><td class="num">68% penduduk usia kerja (2025)</td></tr>
          <tr><th>Pekerja informal</th><td class="num">58% (2024)</td></tr>
        </tbody></table>
        ${sourceNote("Sumber: BPS 2024; World Bank WDI 2024–2025.")}</div>
    </div>
    <div class="callout"><strong>Baca bersama:</strong> pendidikan dan kesehatan
    adalah dua pertiga komponen IPM — lihat juga
    <a href="#/kesehatan">Kesehatan</a> dan <a href="#/ekonomi">Ekonomi</a>.</div>`;
}

window.addEventListener("hashchange", render);
render();
