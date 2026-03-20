/* ═══════════════════════════════════════════════════════════════
   TEBAK SPY — app.js  (Frontend Socket.io client)
   ═══════════════════════════════════════════════════════════════ */

// Server URL — arahkan ke backend Node.js yang berjalan di hosting
const SERVER_URL = 'https://elearning.semestaspace.com';
const socket = io(SERVER_URL);

// ── Client State ──────────────────────────────────────────────
let myId        = null;
let myName      = null;
let myIsAdmin   = false;
let myWord      = null;
let myRole      = null;
let currentRoomId   = null;
let currentPlayers  = [];
let hasVoted    = false;

// ── DOM helpers ───────────────────────────────────────────────
const screens = {
  lobby:   document.getElementById('screen-lobby'),
  waiting: document.getElementById('screen-waiting'),
  loading: document.getElementById('screen-loading'),
  playing: document.getElementById('screen-playing'),
  voting:  document.getElementById('screen-voting'),
  ended:   document.getElementById('screen-ended'),
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  if (screens[name]) screens[name].classList.add('active');
}

function showError(elementId, msg) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 4000);
}

function showToast(msg, duration = 3000) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.classList.add('hidden'), 350);
  }, duration);
}

// ── Avatar Initial helper ─────────────────────────────────────
function avatarInitial(name) {
  const icons = ['👤','🧑','🧒','👩','🧔','👦','🙋','😎'];
  return icons[name.charCodeAt(0) % icons.length];
}

// ═══════════════════════════════════════════════════════════════
//  LOBBY
// ═══════════════════════════════════════════════════════════════
const btnJoin   = document.getElementById('btn-join');
const inputName = document.getElementById('input-name');
const inputRoom = document.getElementById('input-room');

// ── Rules Accordion ───────────────────────────────────────────
const btnRulesToggle = document.getElementById('btn-rules-toggle');
const rulesBody      = document.getElementById('rules-body');
btnRulesToggle.addEventListener('click', () => {
  const isOpen = rulesBody.classList.toggle('open');
  btnRulesToggle.setAttribute('aria-expanded', isOpen);
});

btnJoin.addEventListener('click', () => {
  const name   = inputName.value.trim();
  const roomId = inputRoom.value.trim().toUpperCase();
  if (!name)   { showError('lobby-error', 'Masukkan namamu terlebih dahulu.'); return; }
  if (!roomId) { showError('lobby-error', 'Masukkan Room ID terlebih dahulu.'); return; }
  socket.emit('joinRoom', { name, roomId });
  btnJoin.disabled = true;
  btnJoin.querySelector('span').textContent = 'Bergabung...';
});

inputRoom.addEventListener('input', () => {
  inputRoom.value = inputRoom.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
});

// ── Generate random Room ID ──────────────────────────────────
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // omit ambiguous chars: I, O, 0, 1
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

const btnGenRoom = document.getElementById('btn-gen-room');
btnGenRoom.addEventListener('click', () => {
  inputRoom.value = generateRoomCode();
  // Spin animation feedback
  btnGenRoom.classList.remove('spinning');
  void btnGenRoom.offsetWidth; // reflow to restart animation
  btnGenRoom.classList.add('spinning');
  btnGenRoom.addEventListener('animationend', () => btnGenRoom.classList.remove('spinning'), { once: true });
});

// Enter key support
[inputName, inputRoom].forEach(el => {
  el.addEventListener('keydown', e => { if (e.key === 'Enter') btnJoin.click(); });
});

// ═══════════════════════════════════════════════════════════════
//  WAITING ROOM
// ═══════════════════════════════════════════════════════════════
const btnStart    = document.getElementById('btn-start');
const inputTheme  = document.getElementById('input-theme');
const adminPanel  = document.getElementById('admin-panel');

btnStart.addEventListener('click', () => {
  const theme = inputTheme.value.trim();
  if (!theme) { showError('waiting-error', 'Masukkan tema permainan terlebih dahulu.'); return; }
  socket.emit('startGame', { theme });
  btnStart.disabled = true;
  btnStart.querySelector('span').textContent = 'Memulai...';
});

inputTheme.addEventListener('keydown', e => { if (e.key === 'Enter') btnStart.click(); });

function renderWaitingRoom(players, adminId) {
  const listEl = document.getElementById('player-list');
  listEl.innerHTML = '';
  players.forEach(p => {
    const item = document.createElement('div');
    item.className = 'player-item';
    item.innerHTML = `
      <div class="player-avatar">${avatarInitial(p.name)}</div>
      <span class="player-name">${escHtml(p.name)}${p.id === myId ? ' <em style="color:var(--accent);font-size:.8rem;">(kamu)</em>' : ''}</span>
      ${p.isAdmin ? '<span class="admin-crown" title="Admin">👑</span>' : ''}
    `;
    listEl.appendChild(item);
  });

  // Dynamic pips (up to 8, pip-min marks the minimum threshold at 3)
  const pipRow = document.getElementById('pip-row');
  pipRow.innerHTML = '';
  for (let i = 1; i <= 8; i++) {
    const pip = document.createElement('div');
    pip.className = 'pip' + (i <= players.length ? ' filled' : '') + (i === 3 ? ' pip-min' : '');
    pipRow.appendChild(pip);
  }
  document.getElementById('player-count-text').textContent = `${players.length} / 8 pemain`;

  // Admin panel
  const isCurrentAdmin = adminId === myId;
  adminPanel.classList.toggle('hidden', !isCurrentAdmin);
  if (isCurrentAdmin) {
    // Reset button to original state in case it was stuck on "Memulai..."
    btnStart.querySelector('span').textContent = 'Mulai Game';
    btnStart.disabled = players.length < 3;
  }
}

// ═══════════════════════════════════════════════════════════════
//  PLAYING SCREEN
// ═══════════════════════════════════════════════════════════════
const btnEndTurn = document.getElementById('btn-end-turn');

btnEndTurn.addEventListener('click', () => {
  socket.emit('endTurn');
  btnEndTurn.disabled = true;
});

function renderPlayingScreen(roomState) {
  const { turnOrder, currentTurnIndex, roundCount, players } = roomState;

  // Badges
  document.getElementById('badge-round').textContent = `Ronde ${Math.min(roundCount, 3)} / 3`;
  document.getElementById('badge-theme').textContent  = `Tema: ${escHtml(roomState.theme || '—')}`;

  // Turn order chips
  const row = document.getElementById('turn-order-row');
  row.innerHTML = '';
  turnOrder.forEach((pid, idx) => {
    const player = players.find(p => p.id === pid);
    if (!player) return;
    const chip = document.createElement('div');
    chip.className = 'turn-chip';
    if (idx === currentTurnIndex) chip.classList.add('active');
    if (idx < currentTurnIndex)  chip.classList.add('done');
    chip.textContent = player.name + (pid === myId ? ' (kamu)' : '');
    row.appendChild(chip);
  });

  // Is it my turn?
  const isMyTurn = turnOrder[currentTurnIndex] === myId;
  btnEndTurn.classList.toggle('hidden', !isMyTurn);
  btnEndTurn.disabled = false;

  const turnText = document.getElementById('turn-status-text');
  if (isMyTurn) {
    turnText.textContent = '⚡ Giliranmu! Ceritakan katamu secara samar, lalu klik Selesai.';
    turnText.className = 'turn-status your-turn';
  } else {
    const currentPlayer = players.find(p => p.id === turnOrder[currentTurnIndex]);
    turnText.textContent = `Menunggu ${currentPlayer ? currentPlayer.name : '...'} selesai berbicara...`;
    turnText.className = 'turn-status';
  }
}

// ═══════════════════════════════════════════════════════════════
//  VOTING SCREEN
// ═══════════════════════════════════════════════════════════════
function renderVotingScreen(players) {
  hasVoted = false;
  const container = document.getElementById('vote-buttons');
  container.innerHTML = '';

  players.forEach(p => {
    // Can't vote for yourself — remove if you want to allow self-vote
    const btn = document.createElement('button');
    btn.className = 'vote-btn';
    btn.dataset.targetId = p.id;
    btn.innerHTML = `
      <div class="vote-avatar">${avatarInitial(p.name)}</div>
      <span>${escHtml(p.name)}${p.id === myId ? ' (kamu)' : ''}</span>
    `;
    btn.addEventListener('click', () => castVote(p.id, btn));
    container.appendChild(btn);
  });

  document.getElementById('vote-progress-text').textContent = `0 / ${players.length} sudah memilih`;
  document.getElementById('vote-progress-bar').style.width = '0%';
}

function castVote(targetId, clickedBtn) {
  if (hasVoted) return;
  hasVoted = true;
  socket.emit('submitVote', { targetId });
  document.querySelectorAll('.vote-btn').forEach(b => {
    b.disabled = true;
    b.classList.remove('selected');
  });
  clickedBtn.classList.add('selected');
}

// ═══════════════════════════════════════════════════════════════
//  ENDED SCREEN
// ═══════════════════════════════════════════════════════════════
const btnRestart = document.getElementById('btn-restart');
btnRestart.addEventListener('click', () => {
  socket.emit('restartGame');
});

function renderEndedScreen(data) {
  const { outcome, accusedName, spyName, spyWord, wordReveal } = data;

  if (outcome === 'civilianWins') {
    document.getElementById('result-emoji').textContent = '🏆';
    document.getElementById('result-title').textContent = 'Sipil Menang!';
    document.getElementById('result-description').innerHTML =
      `Suara terbanyak jatuh pada <strong>${escHtml(accusedName)}</strong> dan dia memang Spy!<br>Spy adalah <strong>${escHtml(spyName)}</strong> dengan kata "<em>${escHtml(spyWord)}</em>".`;
  } else {
    document.getElementById('result-emoji').textContent = '🕵️';
    document.getElementById('result-title').textContent = 'Spy Menang!';
    document.getElementById('result-description').innerHTML =
      `Suara terbanyak salah menuduh <strong>${escHtml(accusedName)}</strong>.<br>Spy sebenarnya adalah <strong>${escHtml(spyName)}</strong> dengan kata "<em>${escHtml(spyWord)}</em>". Spy lolos!`;

    // Flash red animation
    document.body.classList.add('spy-wins-flash');
    setTimeout(() => document.body.classList.remove('spy-wins-flash'), 3200);
  }

  // Word reveal table
  const tbl = document.getElementById('word-reveal');
  tbl.innerHTML = '';
  wordReveal.forEach(p => {
    const row = document.createElement('div');
    row.className = `reveal-row${p.role === 'spy' ? ' is-spy' : ''}`;
    row.innerHTML = `
      <div class="vote-avatar" style="width:34px;height:34px;font-size:1rem;">${avatarInitial(p.name)}</div>
      <span class="reveal-name">${escHtml(p.name)}${p.id === myId ? ' (kamu)' : ''}</span>
      <span class="reveal-word">"${escHtml(p.word)}"</span>
      <span class="reveal-role-tag ${p.role}">${p.role === 'spy' ? '🕵️ Spy' : '👤 Sipil'}</span>
    `;
    tbl.appendChild(row);
  });

  // Admin restart
  document.getElementById('admin-restart-panel').classList.toggle('hidden', !myIsAdmin);
  document.getElementById('non-admin-wait').classList.toggle('hidden', myIsAdmin);

  showScreen('ended');
}

// ── XSS guard ─────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ═══════════════════════════════════════════════════════════════
//  SOCKET EVENTS
// ═══════════════════════════════════════════════════════════════

// ── Joined Room ───────────────────────────────────────────────
socket.on('joinedRoom', ({ playerId, isAdmin, roomId, name }) => {
  myId      = playerId;
  myName    = name;
  myIsAdmin = isAdmin;
  currentRoomId = roomId;

  // Reset lobby button
  btnJoin.disabled = false;
  btnJoin.querySelector('span').textContent = 'Masuk Room';

  document.getElementById('display-room-id').textContent = roomId;
  showScreen('waiting');
});

// ── Room Update (players, status, turn info) ──────────────────
socket.on('roomUpdate', (state) => {
  currentPlayers = state.players;

  if (state.status === 'waiting') {
    renderWaitingRoom(state.players, state.adminId);
    // Sync admin flag (in case of promotion)
    myIsAdmin = state.adminId === myId;
    showScreen('waiting');

  } else if (state.status === 'playing') {
    renderPlayingScreen({ ...state, theme: state.theme || document.getElementById('badge-theme').textContent.replace('Tema: ', '') });
    showScreen('playing');

  } else if (state.status === 'voting') {
    // handled by startVoting
  } else if (state.status === 'ended') {
    // Sync admin panel visibility if handover happens while on ended screen
    const isCurrentAdmin = state.adminId === myId;
    const panel = document.getElementById('admin-restart-panel');
    const hint = document.getElementById('non-admin-wait');
    if (panel && hint) {
      panel.classList.toggle('hidden', !isCurrentAdmin);
      hint.classList.toggle('hidden', isCurrentAdmin);
    }
  }

  // Sync admin flag for any status
  myIsAdmin = state.adminId === myId;
});

// ── Game Loading ──────────────────────────────────────────────
socket.on('gameLoading', ({ message }) => {
  document.getElementById('loading-text').textContent = message;
  showScreen('loading');
});

// ── Game Started ──────────────────────────────────────────────
socket.on('gameStarted', ({ word, role, theme }) => {
  myWord = word;
  myRole = role;

  document.getElementById('player-word').textContent = word;

  // Cache theme on badge for roomUpdate
  document.getElementById('badge-theme').textContent = `Tema: ${escHtml(theme)}`;

  showScreen('playing');
  showToast('🎮 Game dimulai! Ceritakan katamu secara samar.', 4000);
});

// ── Start Voting ──────────────────────────────────────────────
socket.on('startVoting', ({ players }) => {
  renderVotingScreen(players);
  showScreen('voting');
  showToast('🗳️ Waktu Voting! Pilih siapa yang menurutmu Spy.', 3500);
});

// ── Vote Update ───────────────────────────────────────────────
socket.on('voteUpdate', ({ votedCount, total }) => {
  document.getElementById('vote-progress-text').textContent = `${votedCount} / ${total} sudah memilih`;
  document.getElementById('vote-progress-bar').style.width = `${(votedCount / total) * 100}%`;
});

// ── Vote Tie ──────────────────────────────────────────────────
socket.on('voteTie', ({ message }) => {
  showToast(`⚖️ ${message}`, 4000);
  hasVoted = false;
  showScreen('playing');
});

// ── Game Ended ────────────────────────────────────────────────
socket.on('gameEnded', (data) => {
  renderEndedScreen(data);
});

// ── Game Restarted ────────────────────────────────────────────
socket.on('gameRestarted', ({ message }) => {
  myWord  = null;
  myRole  = null;
  hasVoted = false;
  btnStart.disabled = true;
  btnStart.querySelector('span').textContent = 'Mulai Game';
  inputTheme.value = '';
  showToast(`🔄 ${message}`, 3000);
  showScreen('waiting');
});

// ── Admin Promoted ────────────────────────────────────────────
socket.on('promotedToAdmin', ({ message }) => {
  myIsAdmin = true;
  showToast(`👑 ${message}`, 3500);
});

// ── Player Left ───────────────────────────────────────────────
socket.on('playerLeft', ({ message }) => {
  showToast(`⚠️ ${message}`, 4500);
});

// ── Error ─────────────────────────────────────────────────────
socket.on('error', ({ message }) => {
  console.error('[Server Error]', message);
  // Determine which screen is active and show error there
  const activeScreen = Object.entries(screens).find(([, el]) => el.classList.contains('active'));
  const screenName   = activeScreen ? activeScreen[0] : 'lobby';
  const errId = {
    lobby: 'lobby-error',
    waiting: 'waiting-error',
    playing: 'playing-error',
    voting: 'voting-error',
  }[screenName] || 'lobby-error';

  showError(errId, message);

  // Re-enable join button if we're on lobby
  if (screenName === 'lobby') {
    btnJoin.disabled = false;
    btnJoin.querySelector('span').textContent = 'Masuk Room';
  }
  if (screenName === 'waiting' && myIsAdmin) {
    btnStart.disabled = currentPlayers.length < 3;
    btnStart.querySelector('span').textContent = 'Mulai Game';
  }
});

// ── Disconnect / Reconnect ────────────────────────────────────
socket.on('disconnect', () => {
  showToast('❌ Koneksi terputus. Mencoba menyambung kembali...', 5000);
});
socket.on('connect', () => {
  if (myId) showToast('✅ Tersambung kembali!', 2000);
});
