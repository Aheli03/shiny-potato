// --- State ---
let userSecret, cpuSecret;
let cpuLow, cpuHigh, cpuLastGuess;
let userLow, userHigh;
let userGuessCount, cpuGuessCount;
let turn, gameOver;

// --- Particle Canvas ---
const canvas = document.getElementById('fx');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function spawnParticles(x, y, color, count) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 6;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      life: 1,
      decay: 0.02 + Math.random() * 0.03,
      size: 3 + Math.random() * 5,
      color
    });
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.life > 0);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.15;
    p.life -= p.decay;
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(animateParticles);
}
animateParticles();

function burst(color, count = 40) {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  spawnParticles(cx, cy, color, count);
}


//  SCREEN NAVIGATION

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const el = document.getElementById(id);
  el.style.display = 'flex';
  requestAnimationFrame(() => el.classList.add('active'));
}


//  START GAME
function startGame() {
  const val = parseInt(document.getElementById('userSecret').value);
  const errEl = document.getElementById('setupError');

  if (!val || val < 1 || val > 1000) {
    errEl.textContent = 'Please enter a number between 1 and 1000.';
    errEl.style.display = 'block';
    return;
  }
  errEl.style.display = 'none';

  userSecret = val;
  cpuSecret = Math.floor(Math.random() * 1000) + 1;
  cpuLow = 1; cpuHigh = 1000;
  userLow = 1; userHigh = 1000;
  userGuessCount = 0; cpuGuessCount = 0;
  gameOver = false;

  document.getElementById('userGuessCount').textContent = '0';
  document.getElementById('cpuGuessCount').textContent = '0';
  document.getElementById('gameLog').innerHTML = '';
  document.getElementById('userGuessInput').value = '';
  document.getElementById('rangeDisplay').textContent = '1 – 1000';

  addLog('Game on! Guess the CPU\'s number.', 'muted');
  showScreen('screen-game');
  setTurn('user');
  burst('#f5c518', 30);
}

//  TURN MANAGEMENT
function setTurn(t) {
  turn = t;
  const turnBar = document.getElementById('turnBar');
  const turnText = document.getElementById('turnText');
  const turnDot  = document.getElementById('turnDot');
  const userPanel = document.getElementById('userPanel');
  const cpuPanel  = document.getElementById('cpuPanel');
  const guessErr  = document.getElementById('guessError');

  if (t === 'user') {
    turnBar.className = 'turn-bar';
    turnText.textContent = 'Your turn — guess the CPU\'s number';
    turnDot.className = 'turn-dot';

    userPanel.classList.remove('hidden');
    cpuPanel.classList.add('hidden');
    guessErr.style.display = 'none';
    setTimeout(() => document.getElementById('userGuessInput').focus(), 100);

  } else {
    cpuLastGuess = Math.floor((cpuLow + cpuHigh) / 2);
    cpuGuessCount++;
    animateStat('cpuGuessCount', cpuGuessCount);

    turnBar.className = 'turn-bar cpu-turn';
    turnText.textContent = "CPU's turn — is it right?";
    turnDot.className = 'turn-dot cpu';

    userPanel.classList.add('hidden');
    cpuPanel.classList.remove('hidden');

    document.getElementById('cpuGuessNum').textContent = cpuLastGuess;
    document.getElementById('cpuRangeHint').textContent =
      'Searching range: ' + cpuLow + ' – ' + cpuHigh;

    addLog('<span class="cpu">CPU</span> guesses <strong>' + cpuLastGuess + '</strong> <span class="muted">(range ' + cpuLow + '–' + cpuHigh + ')</span>');
  }
}

//  USER SUBMITS A GUESS
function submitUserGuess() {
  if (gameOver) return;
  const input = document.getElementById('userGuessInput');
  const val = parseInt(input.value);
  const errEl = document.getElementById('guessError');

  if (!val || val < userLow || val > userHigh) {
    errEl.textContent = 'Enter a number between ' + userLow + ' and ' + userHigh + '.';
    errEl.style.display = 'block';
    shakeEl(input);
    return;
  }
  errEl.style.display = 'none';
  input.value = '';
  userGuessCount++;
  animateStat('userGuessCount', userGuessCount);

  if (val === cpuSecret) {
    addLog('<span class="you">You</span> guessed <strong>' + val + '</strong> — <span class="win">Correct! 🎉</span>');
    burst('#00e5c8', 60);
    setTimeout(() => endGame('user'), 600);
    return;
  } else if (val < cpuSecret) {
    addLog('<span class="you">You</span> guessed <strong>' + val + '</strong> — Too low, go higher ↑');
    userLow = val + 1;
    burst('#4fa3ff', 20);
  } else {
    addLog('<span class="you">You</span> guessed <strong>' + val + '</strong> — Too high, go lower ↓');
    userHigh = val - 1;
    burst('#ff4f4f', 20);
  }

  document.getElementById('rangeDisplay').textContent = userLow + ' – ' + userHigh;
  setTurn('cpu');
}

//  USER GIVES CPU A HINT
function giveHint(hint) {
  if (gameOver) return;

  if (hint === 'correct') {
    addLog('<span class="cpu">CPU</span> guessed <strong>' + cpuLastGuess + '</strong> — <span class="win">CPU wins! 🤖</span>');
    burst('#ff4f4f', 60);
    setTimeout(() => endGame('cpu'), 600);
    return;
  } else if (hint === 'lower') {
    addLog('You told CPU: too high → go lower <span class="muted">(your secret: ' + userSecret + ')</span>');
    cpuHigh = cpuLastGuess - 1;
    burst('#ff4f4f', 15);
  } else {
    addLog('You told CPU: too low → go higher <span class="muted">(your secret: ' + userSecret + ')</span>');
    cpuLow = cpuLastGuess + 1;
    burst('#4fa3ff', 15);
  }
  setTurn('user');
}

//  END GAME
function endGame(winner) {
  gameOver = true;

  const crown   = document.getElementById('resultCrown');
  const headline = document.getElementById('resultHeadline');
  const flavor  = document.getElementById('resultFlavor');
  const stats   = document.getElementById('resultStats');

  if (winner === 'user') {
    crown.textContent = '🏆';
    headline.textContent = 'You win!';
    flavor.textContent = 'You cracked the CPU\'s number (' + cpuSecret + ') before it cracked yours.';
  } else {
    crown.textContent = '🤖';
    headline.textContent = 'CPU wins!';
    flavor.textContent = 'The computer cracked your number (' + userSecret + '). Rematch?';
  }

  stats.innerHTML =
    '<div class="stat-card">' +
      '<div class="stat-who">You</div>' +
      '<div class="stat-num">' + userGuessCount + '</div>' +
      '<div class="stat-label">guess' + (userGuessCount !== 1 ? 'es' : '') + '</div>' +
    '</div>' +
    '<div class="stat-card">' +
      '<div class="stat-who">CPU</div>' +
      '<div class="stat-num">' + cpuGuessCount + '</div>' +
      '<div class="stat-label">guess' + (cpuGuessCount !== 1 ? 'es' : '') + '</div>' +
    '</div>';

  showScreen('screen-result');
}

//  RESET
function resetGame() {
  document.getElementById('userSecret').value = '';
  document.getElementById('setupError').style.display = 'none';
  showScreen('screen-setup');
}

//  HELPERS
function addLog(html) {
  const log = document.getElementById('gameLog');
  const div = document.createElement('div');
  div.className = 'log-entry';
  div.innerHTML = html;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function animateStat(id, val) {
  const el = document.getElementById(id);
  el.textContent = val;
  el.classList.remove('bump');
  void el.offsetWidth;
  el.classList.add('bump');
}

function shakeEl(el) {
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = 'shake 0.35s ease';
  el.addEventListener('animationend', () => el.style.animation = '', { once: true });
}

// Inject shake keyframes
const style = document.createElement('style');
style.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}';
document.head.appendChild(style);

// Keyboard: Enter to fire
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && turn === 'user' && !gameOver) submitUserGuess();
});

// Init
showScreen('screen-setup');