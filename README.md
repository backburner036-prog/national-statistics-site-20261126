# Statistik Indonesia 2026 — 12 Indikator v1

[![Bounty: best-national-statistics-site-20261126-0539](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/backburner036-prog/national-statistics-site-20261126/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)
[![Reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/backburner036-prog/national-statistics-site-20261126/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539)

Situs statistik nasional statis untuk Indonesia: 12 indikator nyata dari
World Bank World Development Indicators dan BPS–Statistics Indonesia, dalam
5 seksi — Ringkasan, Penduduk, Ekonomi, Kesehatan, Pendidikan — dengan grafik
SVG interaktif yang digambar dari data, tanpa satu pun request network.

- Situs: `app/` — file statis, tanpa build step. Buka `app/index.html` lewat
  server statis apa pun (`node serve.ts` → http://localhost:8080).
- Program penyerahan: `main.ts` (Node 22, standard library only) — menyalin
  `app/` dan `screenshots/` ke `/output` dan menulis `dossier.json`.
- Bounty: https://make.fun/bounty/best-national-statistics-site-20261126-0539

## Angka yang dipakai (sumber + tahun, lengkap di halaman)
- Penduduk 285,7 juta (2025, World Bank WDI) · PDB US$1,45 triliun (2025, WDI)
- PDB per kapita US$5.059,6 (2025) · pertumbuhan PDB 5,1% (2025)
- Pengangguran 4,85% Agustus 2025 (BPS Sakernas) · inflasi 1,9% (2025, WDI)
- Harapan hidup 71,3 tahun (2024, WDI) · IPM 75,02 (2024, BPS)
- Kemiskinan 8,57% (Sep 2024, BPS) · pengguna internet 72,8% (2024, WDI)

Riset lengkap: `~/workspace/makefun/20261126-4bounty/national-statistics-20261126-research.md`
