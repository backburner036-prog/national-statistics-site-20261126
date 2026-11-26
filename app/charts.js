// charts.js — grafik SVG dari data, tanpa library, tanpa network.
// Ditulis ulang untuk rebuild pasca-buka. Satu fungsi per jenis grafik.

export function formatAngka(n, decimals = 1) {
  return n.toLocaleString("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function openSvg(width, height, label) {
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">`;
}

// Grafik garis: data [{year, value}], dengan titik, label nilai, dan sumbu.
export function lineChart(data, { width = 640, height = 260, color = "#1f6f8b", unit = "", decimals = 1 } = {}) {
  const padL = 52, padR = 16, padT = 18, padB = 30;
  const vals = data.map((d) => d.value);
  const min = Math.min(...vals), max = Math.max(...vals);
  const span = max - min || 1;
  const lo = min - span * 0.15, hi = max + span * 0.15;
  const xAt = (i) => padL + (i * (width - padL - padR)) / (data.length - 1);
  const yAt = (v) => padT + ((hi - v) * (height - padT - padB)) / (hi - lo);
  const bottom = height - padB;
  let s = openSvg(width, height, "Grafik garis");
  s += `<line x1="${padL}" y1="${padT}" x2="${padL}" y2="${bottom}" stroke="#94a3b8" stroke-width="1"/>`;
  s += `<line x1="${padL}" y1="${bottom}" x2="${width - padR}" y2="${bottom}" stroke="#94a3b8" stroke-width="1"/>`;
  for (let g = 0; g <= 3; g++) {
    const v = lo + ((hi - lo) * g) / 3;
    const gy = yAt(v);
    s += `<line x1="${padL}" y1="${gy}" x2="${width - padR}" y2="${gy}" stroke="#e2e8f0" stroke-width="1"/>`;
    s += `<text x="${padL - 6}" y="${gy + 4}" text-anchor="end" font-size="11" fill="#64748b">${formatAngka(v, decimals)}${unit}</text>`;
  }
  s += `<polyline points="${data.map((d, i) => `${xAt(i)},${yAt(d.value)}`).join(" ")}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>`;
  data.forEach((d, i) => {
    s += `<circle cx="${xAt(i)}" cy="${yAt(d.value)}" r="4" fill="${color}"><title>${d.year}: ${formatAngka(d.value, decimals)}${unit}</title></circle>`;
    s += `<text x="${xAt(i)}" y="${yAt(d.value) - 10}" text-anchor="middle" font-size="11" font-weight="600" fill="#0f172a">${formatAngka(d.value, decimals)}</text>`;
    s += `<text x="${xAt(i)}" y="${height - 10}" text-anchor="middle" font-size="11" fill="#64748b">${d.year}</text>`;
  });
  return s + "</svg>";
}

// Grafik batang, vertikal (default) atau horizontal.
// data: [{label, value}]
export function barChart(data, { width = 640, height = 280, color = "#2a9d8f", unit = "", decimals = 1, horizontal = false } = {}) {
  if (horizontal) {
    const padL = 150, padR = 56, rowH = 34, padT = 8;
    const h = padT * 2 + data.length * rowH;
    const max = Math.max(...data.map((d) => d.value)) * 1.08;
    let s = openSvg(width, h, "Grafik batang horizontal");
    data.forEach((d, i) => {
      const y = padT + i * rowH;
      const bw = ((width - padL - padR) * d.value) / max;
      s += `<text x="${padL - 8}" y="${y + 17}" text-anchor="end" font-size="12" fill="#0f172a">${d.label}</text>`;
      s += `<rect x="${padL}" y="${y + 4}" width="${bw.toFixed(1)}" height="18" fill="${color}" rx="3"><title>${d.label}: ${formatAngka(d.value, decimals)}${unit}</title></rect>`;
      s += `<text x="${padL + bw + 6}" y="${y + 18}" font-size="12" font-weight="600" fill="#0f172a">${formatAngka(d.value, decimals)}${unit}</text>`;
    });
    return s + "</svg>";
  }
  const padL = 52, padR = 10, padT = 20, padB = 44;
  const minV = Math.min(0, ...data.map((d) => d.value));
  const maxV = Math.max(0, ...data.map((d) => d.value)) * 1.12;
  const range = maxV - minV || 1;
  const plotH = height - padT - padB;
  const y0 = padT + (plotH * (maxV - 0)) / range; // garis nol
  const bw = (width - padL - padR) / data.length;
  let s = openSvg(width, height, "Grafik batang");
  s += `<line x1="${padL}" y1="${y0}" x2="${width - padR}" y2="${y0}" stroke="#94a3b8"/>`;
  data.forEach((d, i) => {
    const h = (Math.abs(d.value) / range) * plotH;
    const bx = padL + i * bw + bw * 0.18;
    const by = d.value >= 0 ? y0 - h : y0;
    const fill = d.value >= 0 ? color : "#b45309";
    s += `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${(bw * 0.64).toFixed(1)}" height="${h.toFixed(1)}" fill="${fill}" rx="3"><title>${d.label}: ${formatAngka(d.value, decimals)}${unit}</title></rect>`;
    const labelY = d.value >= 0 ? by - 6 : by + h + 14;
    s += `<text x="${(bx + bw * 0.32).toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="#0f172a">${formatAngka(d.value, decimals)}</text>`;
    s += `<text x="${(bx + bw * 0.32).toFixed(1)}" y="${height - padB + 16}" text-anchor="middle" font-size="11" fill="#64748b">${d.label}</text>`;
  });
  return s + "</svg>";
}

// Grafik donat: data [{label, value, color}]
export function donutChart(data, { size = 260 } = {}) {
  const cx = size / 2, cy = size / 2;
  const r = size / 2 - 14, inner = r * 0.62;
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let s = openSvg(size, size, "Grafik donat");
  let angle = -90;
  data.forEach((d) => {
    const frac = d.value / total;
    const a0 = (angle * Math.PI) / 180;
    const a1 = ((angle + frac * 360) * Math.PI) / 180;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0);
    s += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${d.color}"><title>${d.label}: ${formatAngka(d.value)}%</title></path>`;
    angle += frac * 360;
  });
  s += `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="20" font-weight="700" fill="#0f172a">${formatAngka(total, 0)}%</text>`;
  s += `<text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="11" fill="#64748b">penduduk</text>`;
  return s + "</svg>";
}
