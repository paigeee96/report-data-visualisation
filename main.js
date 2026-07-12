/* ============================================================
   main.js
   Structure per movement:
     - full-length video (NI + Para already combined side by side
       in the frame — just a single <video>, no syncing needed)
     - trimmed/step video with angle graph baked in (also NI + Para
       already combined in-frame — single <video>)
     - 3 static charts side by side (hip, knee, ankle), each
       overlaying NI vs Para for that joint
   Swap the SAMPLE_SERIES data and <video> src attributes for your own.
   ============================================================ */

const JOINTS = ['hip', 'knee', 'ankle'];

function makeSeries(duration, freq, phase, amp, offset) {
  const rows = [];
  for (let t = 0; t <= duration; t += 0.5) {
    const value = offset + amp * Math.sin(t / freq + phase) + (Math.random() - 0.5) * 3;
    rows.push({ t, value: Math.round(value * 10) / 10 });
  }
  return rows;
}

// SAMPLE_SERIES[movement][group][joint] -> [{t, value}, ...]
// Replace with your real angle data (used only for the 3 static comparison charts).
const SAMPLE_SERIES = {
  m1: {
    ni:   { hip: makeSeries(30, 3, 0.0, 22, 40), knee: makeSeries(30, 2.6, 0.5, 35, 60), ankle: makeSeries(30, 2.2, 1.0, 15, 20) },
    para: { hip: makeSeries(30, 3, 0.9, 20, 38), knee: makeSeries(30, 2.6, 1.4, 33, 58), ankle: makeSeries(30, 2.2, 1.9, 14, 19) },
  },
  m2: {
    ni:   { hip: makeSeries(24, 2.4, 0.2, 26, 45), knee: makeSeries(24, 2.0, 0.7, 38, 65), ankle: makeSeries(24, 1.8, 1.2, 18, 22) },
    para: { hip: makeSeries(24, 2.4, 1.1, 24, 43), knee: makeSeries(24, 2.0, 1.6, 36, 63), ankle: makeSeries(24, 1.8, 2.1, 17, 21) },
  },
};

// One static combined chart for a single joint, overlaying NI vs Para
function initCombinedJointChart(canvasId, seriesNI, seriesPara) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return;

  new Chart(canvas, {
    type: 'line',
    data: {
      labels: seriesNI.map(p => p.t),
      datasets: [
        { label: 'NI', data: seriesNI.map(p => p.value), borderColor: '#0E7C7B', backgroundColor: '#0E7C7B', borderWidth: 2, pointRadius: 0, tension: 0.25 },
        { label: 'Para', data: seriesPara.map(p => p.value), borderColor: '#D6572D', backgroundColor: '#D6572D', borderWidth: 2, pointRadius: 0, tension: 0.25 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
      scales: {
        x: { type: 'linear', title: { display: true, text: 'time (s)', font: { family: 'IBM Plex Mono', size: 10 } }, grid: { color: '#C9C2AD55' }, ticks: { font: { family: 'IBM Plex Mono', size: 9 }, maxTicksLimit: 6 } },
        y: { title: { display: true, text: 'angle (°)', font: { family: 'IBM Plex Mono', size: 10 } }, grid: { color: '#C9C2AD55' }, ticks: { font: { family: 'IBM Plex Mono', size: 9 } } }
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  JOINTS.forEach(joint => initCombinedJointChart(`m1Combined_${joint}`, SAMPLE_SERIES.m1.ni[joint], SAMPLE_SERIES.m1.para[joint]));
  JOINTS.forEach(joint => initCombinedJointChart(`m2Combined_${joint}`, SAMPLE_SERIES.m2.ni[joint], SAMPLE_SERIES.m2.para[joint]));
});
