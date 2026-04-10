const CHOICES = {
  water: { emoji: '💧', label: 'Water', beats: 'gun',   key: 'w' },
  gun:   { emoji: '🔫', label: 'Gun',   beats: 'snake', key: 'g' },
  snake: { emoji: '🐍', label: 'Snake', beats: 'water', key: 's' },
};

const EXPLAINS = {
  'water-gun':   'Water rusts the Gun.',
  'gun-snake':   'Gun shoots the Snake.',
  'snake-water': 'Snake drinks the Water.',
};

let scores = { player: 0, computer: 0, draw: 0 };

// DOM refs
const playerScoreEl  = document.getElementById('playerScore');
const computerScoreEl= document.getElementById('computerScore');
const drawScoreEl    = document.getElementById('drawScore');
const rulesCard      = document.getElementById('rulesCard');
const picksArea      = document.getElementById('picksArea');
const resultArea     = document.getElementById('resultArea');
const playerEmoji    = document.getElementById('playerEmoji');
const playerName     = document.getElementById('playerName');
const cpuEmoji       = document.getElementById('cpuEmoji');
const cpuName        = document.getElementById('cpuName');
const outcomeBand    = document.getElementById('outcomeBand');
const outcomeText    = document.getElementById('outcomeText');
const outcomeExplain = document.getElementById('outcomeExplain');
const playAgainBtn   = document.getElementById('playAgainBtn');
const resetBtn       = document.getElementById('resetBtn');

// Bind pick buttons
document.querySelectorAll('.pick-btn').forEach(btn => {
  btn.addEventListener('click', () => play(btn.dataset.choice));
});

playAgainBtn.addEventListener('click', showPicks);
resetBtn.addEventListener('click', resetScores);

// Keyboard
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (!resultArea.classList.contains('hidden')) {
    if (k === ' ' || k === 'enter') { e.preventDefault(); showPicks(); }
    return;
  }
  Object.entries(CHOICES).forEach(([choice, data]) => {
    if (k === data.key) play(choice);
  });
  if (k === 'r') resetScores();
});

function play(playerChoice) {
  const cpuChoice = randomChoice();
  const result = getResult(playerChoice, cpuChoice);

  // Update scores
  if (result === 'win')  scores.player++;
  if (result === 'lose') scores.computer++;
  if (result === 'draw') scores.draw++;
  renderScores(result);

  // Hide rules + picks, show result
  rulesCard.classList.add('hidden');
  picksArea.style.opacity = '0';
  picksArea.style.pointerEvents = 'none';

  setTimeout(() => {
    picksArea.style.display = 'none';
    picksArea.style.opacity = '';
    picksArea.style.pointerEvents = '';

    // Fill result
    playerEmoji.textContent = CHOICES[playerChoice].emoji;
    playerName.textContent  = CHOICES[playerChoice].label;
    cpuEmoji.textContent    = CHOICES[cpuChoice].emoji;
    cpuName.textContent     = CHOICES[cpuChoice].label;

    outcomeBand.className = 'outcome-band ' + result;

    if (result === 'win')  { outcomeText.textContent = '🎉 You Win!'; }
    if (result === 'lose') { outcomeText.textContent = '😬 You Lose!'; }
    if (result === 'draw') { outcomeText.textContent = '🤝 Draw!'; }

    const winnerKey = result === 'win' ? `${playerChoice}-${cpuChoice}` : `${cpuChoice}-${playerChoice}`;
    outcomeExplain.textContent = result === 'draw' ? 'Same choice — no contest.' : (EXPLAINS[winnerKey] || '');

    resultArea.classList.remove('hidden');
    playAgainBtn.focus();
  }, 120);
}

function showPicks() {
  resultArea.classList.add('hidden');
  picksArea.style.display = '';
  picksArea.style.opacity = '0';
  requestAnimationFrame(() => {
    picksArea.style.transition = 'opacity 0.2s';
    picksArea.style.opacity = '1';
    setTimeout(() => picksArea.style.transition = '', 220);
  });
}

function randomChoice() {
  const keys = Object.keys(CHOICES);
  return keys[Math.floor(Math.random() * keys.length)];
}

function getResult(player, cpu) {
  if (player === cpu) return 'draw';
  return CHOICES[player].beats === cpu ? 'win' : 'lose';
}

function renderScores(lastResult) {
  playerScoreEl.textContent   = scores.player;
  computerScoreEl.textContent = scores.computer;
  drawScoreEl.textContent     = scores.draw;

  const bumpEl = lastResult === 'win' ? playerScoreEl : lastResult === 'lose' ? computerScoreEl : drawScoreEl;
  bumpEl.classList.add('bump');
  setTimeout(() => bumpEl.classList.remove('bump'), 250);
}

function resetScores() {
  scores = { player: 0, computer: 0, draw: 0 };
  playerScoreEl.textContent   = 0;
  computerScoreEl.textContent = 0;
  drawScoreEl.textContent     = 0;
  resultArea.classList.add('hidden');
  rulesCard.classList.remove('hidden');
  picksArea.style.display = '';
  picksArea.style.opacity = '1';
}
