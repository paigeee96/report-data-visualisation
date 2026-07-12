/* ============================================================
   main.js
   Structure per movement:
     - full-length pair, side by side (plain video, "play both, synced")
     - "step" pair, side by side (plain video — these clips already
       have the moving graph baked in from MATLAB, so no JS syncing
       needed here at all)
     - 3 static charts side by side (hip, knee, ankle), each
       overlaying Video A vs Video B for that joint
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

// SAMPLE_SERIES[movement][video][joint] -> [{t, value}, ...]
// Replace with your real angle data (used only for the 3 static comparison charts).
const SAMPLE_SERIES = {
  m1: {
    a: {
      hip:   makeSeries(30, 3, 0.0, 22, 40),
      knee:  makeSeries(30, 2.6, 0.5, 35, 60),
      ankle: makeSeries(30, 2.2, 1.0, 15, 20),
    },
    b: {
      hip:   makeSeries(30, 3, 0.9, 20, 38),
      knee:  makeSeries(30, 2.6, 1.4, 33, 58),
      ankle: makeSeries(30, 2.2, 1.9, 14, 19),
    },
  },
  m2: {
    a: {
      hip:   makeSeries(24, 2.4, 0.2, 26, 45),
      knee:  makeSeries(24, 2.0, 0.7, 38, 65),
      ankle: makeSeries(24, 1.8, 1.2, 18, 22),
    },
    b: {
      hip:   makeSeries(24, 2.4, 1.1, 24, 43),
      knee:  makeSeries(24, 2.0, 1.6, 36, 63),
      ankle: makeSeries(24, 1.8, 2.1, 17, 21),
    },
  },
};

// One static combined chart for a single joint, overlaying Video A vs Video B
function initCombinedJointChart(canvasId, seriesA, seriesB) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return;

  new Chart(canvas, {
    type: 'line',
    data: {
      labels: seriesA.map(p => p.t),
      datasets: [
        { label: 'Video A', data: seriesA.map(p => p.value), borderColor: '#0E7C7B', backgroundColor: '#0E7C7B', borderWidth: 2, pointRadius: 0, tension: 0.25 },
        { label: 'Video B', data: seriesB.map(p => p.value), borderColor: '#D6572D', backgroundColor: '#D6572D', borderWidth: 2, pointRadius: 0, tension: 0.25 }
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

// Keeps two videos roughly in lockstep and gives them one shared play/pause button
function initSyncButton(btnId, videoIdA, videoIdB) {
  const btn = document.getElementById(btnId);
  const a = document.getElementById(videoIdA);
  const b = document.getElementById(videoIdB);
  if (!btn || !a || !b) return;

  let playing = false;
  btn.addEventListener('click', () => {
    if (!playing) {
      a.currentTime = b.currentTime = 0;
      Promise.all([a.play(), b.play()]);
      btn.querySelector('.btn-label').textContent = 'Pause both';
    } else {
      a.pause(); b.pause();
      btn.querySelector('.btn-label').textContent = 'Play both, synced';
    }
    playing = !playing;
  });

  a.addEventListener('timeupdate', () => {
    if (Math.abs(a.currentTime - b.currentTime) > 0.25) b.currentTime = a.currentTime;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Movement 1
  initSyncButton('m1LongSyncBtn', 'm1LongA', 'm1LongB');
  initSyncButton('m1StepSyncBtn', 'm1StepA', 'm1StepB');
  JOINTS.forEach(joint => initCombinedJointChart(`m1Combined_${joint}`, SAMPLE_SERIES.m1.a[joint], SAMPLE_SERIES.m1.b[joint]));

  // Movement 2
  initSyncButton('m2LongSyncBtn', 'm2LongA', 'm2LongB');
  initSyncButton('m2StepSyncBtn', 'm2StepA', 'm2StepB');
  JOINTS.forEach(joint => initCombinedJointChart(`m2Combined_${joint}`, SAMPLE_SERIES.m2.a[joint], SAMPLE_SERIES.m2.b[joint]));
});
