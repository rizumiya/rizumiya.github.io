// ============================================================
// Data & State
// ============================================================
let currentPlayer = null;
let players = [];
let gameData = {
    differenceZone: null,
    differenceType: 'color',
    differenceColor: null,
    isGameActive: false,
    particles: [],
    differenceParticleIndex: -1
};

// Canvas logical size — updated dynamically
let CANVAS_SIZE = 400;
let CENTER_X = 200;
let CENTER_Y = 200;
let RADIUS = 170;

// Radar animation
let animationId = null;
let beamAngle = 0;
const BEAM_SPEED = 0.02;

// Selected zone via quick-pick buttons
let selectedZone = null;

// ============================================================
// Leaderboard helpers
// ============================================================
function loadLeaderboard() {
    players = JSON.parse(localStorage.getItem('radarGamePlayers')) || [];
}

function saveLeaderboard() {
    localStorage.setItem('radarGamePlayers', JSON.stringify(players));
}

// ============================================================
// DOM references — resolved after DOMContentLoaded
// ============================================================
let registrationPage, gamePage, leaderboardPage;
let registrationForm, playerNameInput, errorMessage;
let resultMessage, nextGameButton, backToMenuButton;
let backToRegistrationButton, leaderboardLink, guessButton, answerZoneInput;
let playerNameDisplay, winsCount, gamesCount;
let radarLeftCanvas, radarRightCanvas, radarLeftMaskCanvas, radarRightMaskCanvas;
let ctxLeft, ctxRight, ctxLeftMask, ctxRightMask;

// ============================================================
// Dynamic canvas sizing
// ============================================================
function getRadarSize() {
    const vw = window.innerWidth;
    const isMobile = vw <= 480;

    if (isMobile) {
        // Full-width single column — each radar gets most of viewport width
        return Math.min(Math.floor(vw * 0.88), 320);
    } else if (vw <= 768) {
        // Side-by-side on tablet
        return Math.min(Math.floor((vw - 60) / 2), 300);
    } else {
        // Desktop
        return Math.min(Math.floor((vw - 120) / 2), 400);
    }
}

function resizeCanvases() {
    const size = getRadarSize();
    CANVAS_SIZE = size;
    CENTER_X = size / 2;
    CENTER_Y = size / 2;
    RADIUS = Math.floor(size / 2) - Math.max(10, Math.floor(size * 0.07));

    // Apply wrapper size via CSS custom property
    const wrappers = document.querySelectorAll('.radar-wrapper');
    wrappers.forEach(w => {
        w.style.width  = size + 'px';
        w.style.height = size + 'px';
    });

    // Resize all four canvases (logical pixel size)
    [radarLeftCanvas, radarRightCanvas, radarLeftMaskCanvas, radarRightMaskCanvas].forEach(c => {
        if (!c) return;
        c.width  = size;
        c.height = size;
    });

    // Reposition labels
    repositionLabels('labels-left');
    repositionLabels('labels-right');
}

function repositionLabels(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const labelRadius = RADIUS + 14; // px distance from centre
    container.querySelectorAll('.radar-label').forEach(el => {
        const angleDeg = parseFloat(el.dataset.angle || 0);
        const rad = (angleDeg * Math.PI) / 180;
        // Position relative to wrapper (50% × 50% = centre)
        const left = 50 + (labelRadius / CANVAS_SIZE) * 100 * Math.sin(rad);
        const top  = 50 - (labelRadius / CANVAS_SIZE) * 100 * Math.cos(rad);
        el.style.left      = left + '%';
        el.style.top       = top  + '%';
        el.style.transform = 'translate(-50%, -50%)';
    });
}

// ============================================================
// Initialisation
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Resolve DOM refs
    registrationPage        = document.getElementById('registration-page');
    gamePage                = document.getElementById('game-page');
    leaderboardPage         = document.getElementById('leaderboard-page');
    registrationForm        = document.getElementById('registration-form');
    playerNameInput         = document.getElementById('player-name');
    errorMessage            = document.getElementById('error-message');
    resultMessage           = document.getElementById('result-message');
    nextGameButton          = document.getElementById('next-game');
    backToMenuButton        = document.getElementById('back-to-menu');
    backToRegistrationButton= document.getElementById('back-to-registration');
    leaderboardLink         = document.getElementById('leaderboard-link');
    guessButton             = document.getElementById('guess-button');
    answerZoneInput         = document.getElementById('answer-zone');
    playerNameDisplay       = document.getElementById('player-name-display');
    winsCount               = document.getElementById('wins-count');
    gamesCount              = document.getElementById('games-count');
    radarLeftCanvas         = document.getElementById('radar-left');
    radarRightCanvas        = document.getElementById('radar-right');
    radarLeftMaskCanvas     = document.getElementById('radar-left-mask');
    radarRightMaskCanvas    = document.getElementById('radar-right-mask');
    ctxLeft                 = radarLeftCanvas.getContext('2d');
    ctxRight                = radarRightCanvas.getContext('2d');
    ctxLeftMask             = radarLeftMaskCanvas.getContext('2d');
    ctxRightMask            = radarRightMaskCanvas.getContext('2d');

    loadLeaderboard();

    // Event listeners
    registrationForm.addEventListener('submit', handleRegistration);
    guessButton.addEventListener('click', handleGuess);
    nextGameButton.addEventListener('click', startNewGame);
    backToMenuButton.addEventListener('click', showRegistrationPage);
    backToRegistrationButton.addEventListener('click', showRegistrationPage);
    leaderboardLink.addEventListener('click', showLeaderboard);

    // Zone-picker quick buttons
    document.querySelectorAll('.zone-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedZone = parseInt(btn.dataset.zone);
            answerZoneInput.value = selectedZone;
            document.querySelectorAll('.zone-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    // Sync text input → zone picker highlight
    answerZoneInput.addEventListener('input', () => {
        const v = parseInt(answerZoneInput.value);
        selectedZone = (v >= 1 && v <= 12) ? v : null;
        document.querySelectorAll('.zone-btn').forEach(b => {
            b.classList.toggle('selected', parseInt(b.dataset.zone) === selectedZone);
        });
    });

    // Resize listener — redraw on orientation/resize
    window.addEventListener('resize', () => {
        if (!gamePage.classList.contains('hidden')) {
            resizeCanvases();
            // Redraw static content; animation loop handles the rest
        }
    });

    // Auto-login
    const savedPlayer = localStorage.getItem('currentRadarPlayer');
    if (savedPlayer) {
        currentPlayer = JSON.parse(savedPlayer);
        showGamePage();
        startNewGame();
    }
});

// ============================================================
// Navigation helpers
// ============================================================
function handleRegistration(e) {
    e.preventDefault();
    const name = playerNameInput.value.trim();
    if (!name) {
        errorMessage.textContent = 'Nama tidak boleh kosong!';
        return;
    }
    let player = players.find(p => p.name === name);
    if (!player) {
        player = { name, gamesPlayed: 0, wins: 0 };
        players.push(player);
    }
    currentPlayer = player;
    localStorage.setItem('currentRadarPlayer', JSON.stringify(currentPlayer));
    saveLeaderboard();
    showGamePage();
    startNewGame();
}

function showRegistrationPage() {
    gamePage.classList.add('hidden');
    leaderboardPage.classList.add('hidden');
    registrationPage.classList.remove('hidden');
    stopAnimation();
}

function showGamePage() {
    registrationPage.classList.add('hidden');
    leaderboardPage.classList.add('hidden');
    gamePage.classList.remove('hidden');
    playerNameDisplay.textContent = currentPlayer.name;
    winsCount.textContent  = currentPlayer.wins;
    gamesCount.textContent = currentPlayer.gamesPlayed;
    // Size canvases once the page is visible
    resizeCanvases();
}

function showLeaderboard() {
    registrationPage.classList.add('hidden');
    gamePage.classList.add('hidden');
    leaderboardPage.classList.remove('hidden');
    stopAnimation();
    updateLeaderboard();
}

function stopAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

// ============================================================
// Leaderboard
// ============================================================
function updateLeaderboard() {
    const tbody = document.getElementById('leaderboard-body');
    tbody.innerHTML = '';
    const sorted = [...players].sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins;
        const aR = a.gamesPlayed > 0 ? a.wins / a.gamesPlayed : 0;
        const bR = b.gamesPlayed > 0 ? b.wins / b.gamesPlayed : 0;
        return bR - aR;
    });
    sorted.forEach((player, i) => {
        const wr = player.gamesPlayed > 0
            ? ((player.wins / player.gamesPlayed) * 100).toFixed(1)
            : '0.0';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${player.name}</td>
            <td>${player.gamesPlayed}</td>
            <td>${player.wins}</td>
            <td>${wr}%</td>
        `;
        tbody.appendChild(row);
    });
}

// ============================================================
// Game logic
// ============================================================
function startNewGame() {
    // Reset UI
    resultMessage.textContent = '';
    resultMessage.className   = '';
    nextGameButton.classList.add('hidden');
    answerZoneInput.value     = '';
    answerZoneInput.disabled  = false;
    guessButton.disabled      = false;
    selectedZone              = null;
    document.querySelectorAll('.zone-btn').forEach(b => {
        b.classList.remove('selected');
        b.disabled = false;
    });

    gameData.differenceZone          = Math.floor(Math.random() * 12) + 1;
    gameData.differenceType          = 'color';
    gameData.differenceColor         = null;
    gameData.isGameActive            = true;

    generateParticles();
    startRadarAnimation();

    console.log('Zona perbedaan:', gameData.differenceZone);
}

function generateParticles() {
    gameData.particles = [];
    gameData.differenceParticleIndex = -1;

    const particleCount = 100;
    const minDistance   = 28;

    function isInTransitionZone(angle) {
        const boundaries = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
        return boundaries.some(b => {
            const diff = Math.abs(angle - b) % 360;
            return diff < 13 || diff > 347;
        });
    }

    function isTooClose(x, y) {
        return gameData.particles.some(p => {
            const dx = p.x - x, dy = p.y - y;
            return Math.sqrt(dx * dx + dy * dy) < minDistance;
        });
    }

    const colors = ['#00ff9d', '#00eeff', '#bb86fc', '#03dac6', '#ff6b6b', '#ffd166'];

    for (let i = 0; i < particleCount; i++) {
        let x, y, angle, distance, attempts = 0;
        do {
            angle    = Math.random() * 360;
            distance = 45 + Math.random() * (RADIUS - 65);
            const rad = (angle * Math.PI) / 180;
            x = CENTER_X + Math.cos(rad) * distance;
            y = CENTER_Y + Math.sin(rad) * distance;
            attempts++;
        } while ((isTooClose(x, y) || isInTransitionZone(angle)) && attempts < 200);

        const size  = 3 + Math.random() * 3;
        const color = colors[Math.floor(Math.random() * colors.length)];
        gameData.particles.push({ x, y, size, color, isDifference: false, angle });
    }

    if (gameData.particles.length > 0) {
        gameData.differenceParticleIndex = Math.floor(Math.random() * gameData.particles.length);
        gameData.particles[gameData.differenceParticleIndex].isDifference = true;
    }
}

// ============================================================
// Drawing
// ============================================================
function drawRadarBackground(ctx) {
    // Outer ring
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = '#bb86fc';
    ctx.lineWidth   = 2;
    ctx.stroke();

    // Inner rings
    [[0.7, 0.5], [0.4, 0.3]].forEach(([r, a]) => {
        ctx.beginPath();
        ctx.arc(CENTER_X, CENTER_Y, RADIUS * r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(187, 134, 252, ${a})`;
        ctx.lineWidth   = 1;
        ctx.stroke();
    });

    // 12 zone lines
    for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI / 6) - Math.PI / 2;
        const inner = 35;
        ctx.beginPath();
        ctx.moveTo(CENTER_X + Math.cos(angle) * inner, CENTER_Y + Math.sin(angle) * inner);
        ctx.lineTo(CENTER_X + Math.cos(angle) * RADIUS, CENTER_Y + Math.sin(angle) * RADIUS);
        ctx.strokeStyle = 'rgba(187, 134, 252, 0.3)';
        ctx.lineWidth   = 1;
        ctx.stroke();
    }
}

function drawParticles(ctx, isRightRadar) {
    gameData.particles.forEach(particle => {
        ctx.shadowColor = particle.color;
        ctx.shadowBlur  = 10;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        ctx.shadowBlur = 0;
    });

    // Extra difference particle on right radar
    if (isRightRadar && gameData.differenceParticleIndex !== -1) {
        const dp = gameData.particles[gameData.differenceParticleIndex];
        if (dp) {
            const colors = ['#00ff9d', '#00eeff', '#bb86fc', '#03dac6', '#ff6b6b', '#ffd166'];
            if (!gameData.differenceColor) {
                let nc;
                do { nc = colors[Math.floor(Math.random() * colors.length)]; }
                while (nc === dp.color);
                gameData.differenceColor = nc;
            }
            ctx.shadowColor = gameData.differenceColor;
            ctx.shadowBlur  = 12;
            ctx.beginPath();
            ctx.arc(dp.x, dp.y, dp.size * 1.2, 0, Math.PI * 2);
            ctx.fillStyle = gameData.differenceColor;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }
}

function drawRadarMask(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.save();
    ctx.translate(CENTER_X, CENTER_Y);
    ctx.rotate(beamAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(RADIUS, -RADIUS * 0.3);
    ctx.arc(0, 0, RADIUS, -0.3, 0.3);
    ctx.closePath();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fill();
    ctx.restore();
    ctx.globalCompositeOperation = 'source-over';
}

// ============================================================
// Animation loop
// ============================================================
function startRadarAnimation() {
    stopAnimation();
    beamAngle = 0;
    animateRadar();
}

function animateRadar() {
    ctxLeft.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctxRight.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctxLeftMask.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctxRightMask.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    drawRadarBackground(ctxLeft);
    drawRadarBackground(ctxRight);
    drawParticles(ctxLeft, false);
    drawParticles(ctxRight, true);
    drawRadarMask(ctxLeftMask);
    drawRadarMask(ctxRightMask);

    beamAngle += BEAM_SPEED;
    if (beamAngle > Math.PI * 2) beamAngle = 0;

    animationId = requestAnimationFrame(animateRadar);
}

// ============================================================
// Guess handling
// ============================================================
function handleGuess() {
    if (!gameData.isGameActive) return;

    const guess = parseInt(answerZoneInput.value);
    if (isNaN(guess) || guess < 1 || guess > 12) {
        resultMessage.textContent = 'Masukkan angka antara 1 dan 12!';
        resultMessage.className   = 'incorrect';
        return;
    }

    answerZoneInput.disabled = true;
    guessButton.disabled     = true;
    document.querySelectorAll('.zone-btn').forEach(b => b.disabled = true);

    const zone = calculateDifferenceZone();

    if (guess === zone) {
        resultMessage.textContent = 'Benar! 🎉 Perbedaan berupa warna partikel.';
        resultMessage.className   = 'correct';
        currentPlayer.wins++;
    } else {
        resultMessage.textContent = `Salah 😟 — Perbedaan di zona ${zone}. Perbedaan berupa warna partikel.`;
        resultMessage.className   = 'incorrect';
    }

    currentPlayer.gamesPlayed++;
    localStorage.setItem('currentRadarPlayer', JSON.stringify(currentPlayer));

    const idx = players.findIndex(p => p.name === currentPlayer.name);
    if (idx !== -1) { players[idx] = currentPlayer; saveLeaderboard(); }

    winsCount.textContent  = currentPlayer.wins;
    gamesCount.textContent = currentPlayer.gamesPlayed;

    nextGameButton.classList.remove('hidden');
    gameData.isGameActive = false;
}

function calculateDifferenceZone() {
    if (gameData.differenceParticleIndex === -1 || !gameData.particles.length) {
        return gameData.differenceZone;
    }
    const dp = gameData.particles[gameData.differenceParticleIndex];
    if (!dp) return gameData.differenceZone;

    let angle = dp.angle % 360;
    if (angle < 0) angle += 360;

    const adjusted = (angle + 90) % 360;
    let zone = Math.floor(adjusted / 30) + 1;
    if (zone > 12) zone = 1;
    if (zone < 1)  zone = 12;

    console.log('Sudut:', dp.angle.toFixed(1), '→ zona:', zone);
    return zone;
}