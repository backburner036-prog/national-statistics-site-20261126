// data.js — angka statistik Indonesia, ditulis ulang untuk rebuild pasca-buka.
// Semua angka nyata; sumber + tahun dicantumkan di halaman.
// Sumber: World Bank World Development Indicators (WDI) dan BPS–Statistics
// Indonesia. Verifikasi lengkap di national-statistics-20261126-research.md.

export const COUNTRY = {
  name: "Indonesia",
  title: "Statistik Indonesia 2026 — 12 Indikator v1",
  capital: "Jakarta",
  landAreaKm2: 1904569,
  provinces: 38,
  worldPopRank: 4,
  worldGdpRank: 17,
};

export const YEARS = [2020, 2021, 2022, 2023, 2024, 2025];

// Penduduk, juta jiwa — World Bank WDI, indikator SP.POP.TOTL
export const POPULATION = [
  { year: 2020, value: 274.0 },
  { year: 2021, value: 276.4 },
  { year: 2022, value: 278.7 },
  { year: 2023, value: 281.2 },
  { year: 2024, value: 283.5 },
  { year: 2025, value: 285.7 },
];

// PDB nominal, triliun US$ — World Bank WDI, NY.GDP.MKTP.CD
export const GDP = [
  { year: 2020, value: 1.06 },
  { year: 2021, value: 1.19 },
  { year: 2022, value: 1.32 },
  { year: 2023, value: 1.37 },
  { year: 2024, value: 1.4 },
  { year: 2025, value: 1.45 },
];

// Pertumbuhan PDB, % per tahun — World Bank WDI
export const GDP_GROWTH = [
  { year: 2020, value: -2.07 },
  { year: 2021, value: 3.7 },
  { year: 2022, value: 5.31 },
  { year: 2023, value: 5.05 },
  { year: 2024, value: 5.03 },
  { year: 2025, value: 5.1 },
];

// PDB per kapita, US$ — World Bank WDI
export const GDP_PER_CAPITA = [
  { year: 2020, value: 3870 },
  { year: 2021, value: 4300 },
  { year: 2022, value: 4740 },
  { year: 2023, value: 4870 },
  { year: 2024, value: 4925 },
  { year: 2025, value: 5060 },
];

// Provinsi terpadat, juta jiwa — BPS, estimasi pertengahan 2024
export const PROVINCES = [
  { name: "Jawa Barat", pop: 50.4 },
  { name: "Jawa Timur", pop: 41.8 },
  { name: "Jawa Tengah", pop: 37.9 },
  { name: "Sumatera Utara", pop: 15.6 },
  { name: "Banten", pop: 12.4 },
  { name: "DKI Jakarta", pop: 10.6 },
  { name: "Sulawesi Selatan", pop: 9.4 },
  { name: "Lampung", pop: 9.2 },
];

// Struktur umur 2024, % — World Bank WDI
export const AGE_GROUPS = [
  { label: "0–14 tahun", value: 24.6, color: "#1f6f8b" },
  { label: "15–64 tahun", value: 68.1, color: "#2a9d8f" },
  { label: "65+ tahun", value: 7.3, color: "#e9c46a" },
];

// Pengangguran terbuka (TPT), % Agustus — BPS Sakernas
export const UNEMPLOYMENT = [
  { year: 2020, value: 7.07 },
  { year: 2021, value: 6.49 },
  { year: 2022, value: 5.86 },
  { year: 2023, value: 5.32 },
  { year: 2024, value: 4.91 },
  { year: 2025, value: 4.85 },
];

// Harapan hidup saat lahir, tahun — World Bank WDI, SP.DYN.LE00.IN
export const LIFE_EXPECTANCY = [
  { year: 2020, value: 70.2 },
  { year: 2021, value: 69.3 },
  { year: 2022, value: 70.1 },
  { year: 2023, value: 70.9 },
  { year: 2024, value: 71.3 },
];

// 12 indikator kunci untuk kartu ringkasan
export const KEY_INDICATORS = [
  { label: "Penduduk", value: "285,7 jt", year: "2025", source: "World Bank WDI", note: "Negara ke-4 terpadat dunia" },
  { label: "PDB nominal", value: "US$1,45 T", year: "2025", source: "World Bank WDI", note: "Ekonomi ke-17 dunia" },
  { label: "PDB per kapita", value: "US$5.060", year: "2025", source: "World Bank WDI", note: "Naik dari US$4.925 (2024)" },
  { label: "Pertumbuhan PDB", value: "5,1%", year: "2025", source: "World Bank WDI", note: "Stabil di atas 5% sejak 2022" },
  { label: "Inflasi (IHK)", value: "1,9%", year: "2025", source: "World Bank WDI", note: "BPS: 1,57% (2024)" },
  { label: "Pengangguran", value: "4,85%", year: "Agu 2025", source: "BPS Sakernas", note: "7,48 jt penganggur (Agu 2024)" },
  { label: "Harapan hidup", value: "71,3 thn", year: "2024", source: "World Bank WDI", note: "BPS: 73,93 tahun (2024)" },
  { label: "Kemiskinan", value: "8,57%", year: "Sep 2024", source: "BPS", note: "Turun dari 9,03% (2024)" },
  { label: "IPM", value: "75,02", year: "2024", source: "BPS", note: "Kategori tinggi" },
  { label: "Rata-rata lama sekolah", value: "8,85 thn", year: "2024", source: "BPS", note: "Harapan lama sekolah 13,33 thn" },
  { label: "Pengguna internet", value: "72,8%", year: "2024", source: "World Bank WDI", note: "Dari total penduduk" },
  { label: "Penduduk perkotaan", value: "58,8%", year: "2024", source: "World Bank WDI", note: "Kepadatan 148,6 jiwa/km² (2023)" },
];

// Pangsa sektor terhadap PDB 2024, % — BPS (pembulatan publikasi)
export const SECTORS = [
  { name: "Industri pengolahan", share: 18.7 },
  { name: "Perdagangan", share: 12.9 },
  { name: "Pertanian", share: 12.5 },
  { name: "Konstruksi", share: 9.9 },
  { name: "Pertambangan", share: 8.6 },
  { name: "Lainnya", share: 37.4 },
];
