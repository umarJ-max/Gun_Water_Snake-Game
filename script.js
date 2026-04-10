// ── Data ──────────────────────────────────────────────────────────────────
const CHOICES = {
  water: { emoji: '💧', label: 'Water', beats: 'gun',   key: 'w' },
  gun:   { emoji: '🔫', label: 'Gun',   beats: 'snake', key: 'g' },
  snake: { emoji: '🐍', label: 'Snake', beats: 'water', key: 's' },
};
const KEYS = Object.fromEntries(Object.entries(CHOICES).map(([c, d]) => [d.key, c]));
const EXPLAINS = {
  'water-gun':   'Water rusts the Gun.',
  'gun-snake':   'Gun shoots the Snake.',
  'snake-water': 'Snake drinks the Water.',
};
const SLOT_FRAMES = ['💧', '🔫', '🐍'];

// ── State ─────────────────────────────────────────────────────────────────
let mode = 'cpu';           // 'cpu' | 'pvp'
let scores = { p1: 0, p2: 0, draw: 0 };
let pvpP1Choice = null;
let slotInterval = null;

// ── DOM ───────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const p1ScoreEl   = $('p1Score');
const p2ScoreEl   = $('p2Score');
const drawScoreEl = $('drawScore');
const p1Label     = $('p1Label');
const p2Label     = $('p2Label');
const rulesCard   = $('rulesCard');
const picksArea   = $('picksArea');
const thinkingArea= $('thinkingArea');
const thPlayerEmoji = $('thPlayerEmoji');
const thPlayerName  = $('thPlayerName');
const thSlot        = $('thSlot');
const pvpStep1    = $('pvpStep1');
const pvpPass     = $('pvpPass');
const pvpStep2    = $('pvpStep2');
const passBtn     = $('passBtn');
const resultArea  = $('resultArea');
const p1Emoji     = $('p1Emoji');
const p1Name      = $('p1Name');
const p1Who       = $('p1Who');
const p2Emoji     = $('p2Emoji');
const p2Name      = $('p2Name');
const p2Who       = $('p2Who');
const outcomeBand = $('outcomeBand');
const outcomeText = $('outcomeText');
const outcomeExplain = $('outcomeExplain');
const playAgainBtn= $('playAgainBtn');
const resetBtn    = $('resetBtn');
const navHint     = $('navHint');

// ── Mode toggle ───────────────────────────────────────────────────────────
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    mode = btn.dataset.mode;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b === btn));
    updateLabels();
    resetAll();
  });
});

function updateLabels() {
  if (mode === 'cpu') {
    p1Label.textContent = 'You';
    p2Label.textContent = 'CPU';
    p1Who.textContent   = 'You';
    p2Who.textContent   = 'CPU';
    navHint.textContent = 'W · G · S keys';
    navHint.style.display = '';
  } else {
    p1Label.textContent = 'Player 1';
    p2Label.textContent = 'Player 2';
    p1Who.textContent   = 'Player 1';
    p2Who.textContent   = 'Player 2';
    navHint.style.display = 'none';
  }
}

// ── CPU mode pick buttons ─────────────────────────────────────────────────
document.querySelectorAll('#picksArea .pick-btn').forEach(btn => {
  btn.addEventListener('click', () => playCpu(btn.dataset.choice));
});

function playCpu(playerChoice) {
  const cpuFinal = randomChoice();

  // Show player's choice immediately + start CPU slot animation
  rulesCard.classList.add('hidden');
  hide(picksArea);
  thPlayerEmoji.textContent = CHOICES[playerChoice].emoji;
  thPlayerName.textContent  = CHOICES[playerChoice].label;
  show(thinkingArea);

  // Slot machine: fast shuffle → slow → stop
  let frame = 0;
  let delay = 80;
  let ticks = 0;
  const totalTicks = 18;

  function tick() {
    thSlot.textContent = SLOT_FRAMES[frame % 3];
    frame++;
    ticks++;
    if (ticks < totalTicks) {
      // Slow down the last 6 ticks
      if (ticks > 12) delay += 40;
      slotInterval = setTimeout(tick, delay);
    } else {
      // Land on final choice
      thSlot.textContent = CHOICES[cpuFinal].emoji;
      thSlot.style.animation = 'none';
      setTimeout(() => {
        hide(thinkingArea);
        thSlot.style.animation = '';
        showResult(playerChoice, cpuFinal, 'cpu');
      }, 420);
    }
  }
  tick();
}

// ── PvP mode ──────────────────────────────────────────────────────────────
document.querySelectorAll('[data-pvp="1"]').forEach(btn => {
  btn.addEventListener('click', () => {
    pvpP1Choice = btn.dataset.choice;
    // Highlight selected
    document.querySelectorAll('[data-pvp="1"]').forEach(b => b.classList.toggle('selected', b === btn));
    setTimeout(() => {
      hide(pvpStep1);
      show(pvpPass);
    }, 180);
  });
});

passBtn.addEventListener('click', () => {
  hide(pvpPass);
  show(pvpStep2);
});

document.querySelectorAll('[data-pvp="2"]').forEach(btn => {
  btn.addEventListener('click', () => {
    const p2Choice = btn.dataset.choice;
    document.querySelectorAll('[data-pvp="2"]').forEach(b => b.classList.toggle('selected', b === btn));
    setTimeout(() => {
      hide(pvpStep2);
      showResult(pvpP1Choice, p2Choice, 'pvp');
    }, 180);
  });
});

// ── Shared result ─────────────────────────────────────────────────────────
function showResult(c1, c2, gameMode) {
  const result = getResult(c1, c2);

  // Update scores
  if (result === 'win')  scores.p1++;
  if (result === 'lose') scores.p2++;
  if (result === 'draw') scores.draw++;
  renderScores(result);

  // Fill result card
  p1Emoji.textContent = CHOICES[c1].emoji;
  p1Name.textContent  = CHOICES[c1].label;
  p2Emoji.textContent = CHOICES[c2].emoji;
  p2Name.textContent  = CHOICES[c2].label;

  outcomeBand.className = 'outcome-band ' + result;

  if (gameMode === 'pvp') {
    outcomeText.textContent = result === 'win'  ? '🎉 Player 1 Wins!'
                            : result === 'lose' ? '🎉 Player 2 Wins!'
                            : '🤝 Draw!';
  } else {
    outcomeText.textContent = result === 'win'  ? '🎉 You Win!'
                            : result === 'lose' ? '😬 You Lose!'
                            : '🤝 Draw!';
  }

  const winKey = result === 'win' ? `${c1}-${c2}` : `${c2}-${c1}`;
  outcomeExplain.textContent = result === 'draw' ? 'Same choice — no contest.'
                             : (EXPLAINS[winKey] || '');

  show(resultArea);
  playAgainBtn.focus();
}

// ── Play again ────────────────────────────────────────────────────────────
playAgainBtn.addEventListener('click', showPicks);

function showPicks() {
  clearTimeout(slotInterval);
  hide(resultArea);
  hide(thinkingArea);
  // Reset pvp button highlights
  document.querySelectorAll('.pick-btn').forEach(b => b.classList.remove('selected'));
  pvpP1Choice = null;

  if (mode === 'cpu') {
    show(picksArea);
  } else {
    hide(pvpPass);
    hide(pvpStep2);
    show(pvpStep1);
  }
}

// ── Reset ─────────────────────────────────────────────────────────────────
resetBtn.addEventListener('click', resetAll);

function resetAll() {
  scores = { p1: 0, p2: 0, draw: 0 };
  p1ScoreEl.textContent   = 0;
  p2ScoreEl.textContent   = 0;
  drawScoreEl.textContent = 0;
  clearTimeout(slotInterval);
  hide(resultArea);
  hide(thinkingArea);
  hide(pvpPass);
  hide(pvpStep2);
  document.querySelectorAll('.pick-btn').forEach(b => b.classList.remove('selected'));
  pvpP1Choice = null;
  rulesCard.classList.remove('hidden');

  if (mode === 'cpu') {
    show(picksArea);
    hide(pvpStep1);
  } else {
    hide(picksArea);
    show(pvpStep1);
  }
}

// ── Keyboard (CPU mode only) ──────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (mode !== 'cpu') return;
  const k = e.key.toLowerCase();
  if (!resultArea.classList.contains('hidden')) {
    if (k === ' ' || k === 'enter') { e.preventDefault(); showPicks(); }
    return;
  }
  if (thinkingArea.classList.contains('hidden') && KEYS[k]) {
    playCpu(KEYS[k]);
  }
  if (k === 'r') resetAll();
});

// ── Helpers ───────────────────────────────────────────────────────────────
function getResult(c1, c2) {
  if (c1 === c2) return 'draw';
  return CHOICES[c1].beats === c2 ? 'win' : 'lose';
}
function randomChoice() {
  const keys = Object.keys(CHOICES);
  return keys[Math.floor(Math.random() * keys.length)];
}
function renderScores(lastResult) {
  p1ScoreEl.textContent   = scores.p1;
  p2ScoreEl.textContent   = scores.p2;
  drawScoreEl.textContent = scores.draw;
  const bump = lastResult === 'win' ? p1ScoreEl : lastResult === 'lose' ? p2ScoreEl : drawScoreEl;
  bump.classList.remove('bump');
  void bump.offsetWidth; // reflow to restart animation
  bump.classList.add('bump');
}
function show(el) { el.classList.remove('hidden'); el.style.display = ''; }
function hide(el) { el.classList.add('hidden'); }

// ── Init ──────────────────────────────────────────────────────────────────
updateLabels();
show(picksArea);
