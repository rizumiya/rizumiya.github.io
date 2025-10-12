// Data pemain dan fungsi penyimpanan
let currentPlayer = null;
let players = [];
let gameData = {
    differenceZone: null,
    differenceType: null, // 'size' atau 'color'
    differenceColor: null, // Warna untuk partikel tambahan
    isGameActive: false,
    particles: [],
    differenceParticleIndex: -1
};

// Fungsi untuk memuat data leaderboard dari file JSON
function loadLeaderboard() {
    // Dalam lingkungan browser, kita tidak bisa langsung membaca file JSON
    // Sebagai gantinya, kita akan menggunakan localStorage seperti sebelumnya
    // atau menggunakan teknologi server-side jika diperlukan
    players = JSON.parse(localStorage.getItem('radarGamePlayers')) || [];
}

// Fungsi untuk menyimpan data leaderboard ke localStorage
function saveLeaderboard() {
    localStorage.setItem('radarGamePlayers', JSON.stringify(players));
}

// DOM Elements
const registrationPage = document.getElementById('registration-page');
const gamePage = document.getElementById('game-page');
const leaderboardPage = document.getElementById('leaderboard-page');
const registrationForm = document.getElementById('registration-form');
const playerNameInput = document.getElementById('player-name');
const errorMessage = document.getElementById('error-message');
const resultMessage = document.getElementById('result-message');
const nextGameButton = document.getElementById('next-game');
const backToMenuButton = document.getElementById('back-to-menu');
const backToRegistrationButton = document.getElementById('back-to-registration');
const leaderboardLink = document.getElementById('leaderboard-link');
const guessButton = document.getElementById('guess-button');
const answerZoneInput = document.getElementById('answer-zone');
const playerNameDisplay = document.getElementById('player-name-display');
const winsCount = document.getElementById('wins-count');
const gamesCount = document.getElementById('games-count');

// Canvas elements
const radarLeftCanvas = document.getElementById('radar-left');
const radarRightCanvas = document.getElementById('radar-right');
const radarLeftMaskCanvas = document.getElementById('radar-left-mask');
const radarRightMaskCanvas = document.getElementById('radar-right-mask');
const ctxLeft = radarLeftCanvas.getContext('2d');
const ctxRight = radarRightCanvas.getContext('2d');
const ctxLeftMask = radarLeftMaskCanvas.getContext('2d');
const ctxRightMask = radarRightMaskCanvas.getContext('2d');

// Canvas dimensions
const CANVAS_SIZE = 400;
const CENTER_X = CANVAS_SIZE / 2;
const CENTER_Y = CANVAS_SIZE / 2;
const RADIUS = Math.min(CENTER_X, CENTER_Y) - 30;

// Animasi radar
let animationId = null;
let beamAngle = 0;
const BEAM_SPEED = 0.02;

// Inisialisasi permainan
document.addEventListener('DOMContentLoaded', () => {
    // Muat leaderboard
    loadLeaderboard();
    
    // Event listeners
    registrationForm.addEventListener('submit', handleRegistration);
    guessButton.addEventListener('click', handleGuess);
    nextGameButton.addEventListener('click', startNewGame);
    backToMenuButton.addEventListener('click', showRegistrationPage);
    backToRegistrationButton.addEventListener('click', showRegistrationPage);
    leaderboardLink.addEventListener('click', showLeaderboard);
    
    // Periksa apakah pemain sudah terdaftar
    const savedPlayer = localStorage.getItem('currentRadarPlayer');
    if (savedPlayer) {
        currentPlayer = JSON.parse(savedPlayer);
        showGamePage();
        startNewGame();
    }
});

// Fungsi pendaftaran
function handleRegistration(e) {
    e.preventDefault();
    const name = playerNameInput.value.trim();
    
    if (!name) {
        errorMessage.textContent = 'Nama tidak boleh kosong!';
        return;
    }
    
    // Cari pemain yang sudah ada atau buat baru
    let player = players.find(p => p.name === name);
    if (!player) {
        player = {
            name: name,
            gamesPlayed: 0,
            wins: 0
        };
        players.push(player);
    }
    
    currentPlayer = player;
    localStorage.setItem('currentRadarPlayer', JSON.stringify(currentPlayer));
    saveLeaderboard();
    
    showGamePage();
    startNewGame();
}

// Menampilkan halaman pendaftaran
function showRegistrationPage() {
    gamePage.classList.add('hidden');
    leaderboardPage.classList.add('hidden');
    registrationPage.classList.remove('hidden');
    
    // Hentikan animasi jika berjalan
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
}

// Menampilkan halaman permainan
function showGamePage() {
    registrationPage.classList.add('hidden');
    leaderboardPage.classList.add('hidden');
    gamePage.classList.remove('hidden');
    
    // Update info pemain
    playerNameDisplay.textContent = currentPlayer.name;
    winsCount.textContent = currentPlayer.wins;
    gamesCount.textContent = currentPlayer.gamesPlayed;
}

// Menampilkan halaman leaderboard
function showLeaderboard() {
    registrationPage.classList.add('hidden');
    gamePage.classList.add('hidden');
    leaderboardPage.classList.remove('hidden');
    
    // Hentikan animasi jika berjalan
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    // Update leaderboard
    updateLeaderboard();
}

// Update leaderboard
function updateLeaderboard() {
    const tbody = document.getElementById('leaderboard-body');
    tbody.innerHTML = '';
    
    // Urutkan pemain berdasarkan kemenangan
    const sortedPlayers = [...players].sort((a, b) => {
        // Urutkan berdasarkan kemenangan terlebih dahulu, kemudian berdasarkan win rate
        if (b.wins !== a.wins) {
            return b.wins - a.wins;
        }
        
        const aWinRate = a.gamesPlayed > 0 ? a.wins / a.gamesPlayed : 0;
        const bWinRate = b.gamesPlayed > 0 ? b.wins / b.gamesPlayed : 0;
        return bWinRate - aWinRate;
    });
    
    sortedPlayers.forEach((player, index) => {
        const winRate = player.gamesPlayed > 0 ? ((player.wins / player.gamesPlayed) * 100).toFixed(1) : '0.0';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td>${player.gamesPlayed}</td>
            <td>${player.wins}</td>
            <td>${winRate}%</td>
        `;
        tbody.appendChild(row);
    });
}

// Memulai permainan baru
function startNewGame() {
    // Reset UI
    resultMessage.textContent = '';
    resultMessage.className = '';
    nextGameButton.classList.add('hidden');
    answerZoneInput.value = '';
    answerZoneInput.disabled = false;
    guessButton.disabled = false;
    
    // Pilih zona perbedaan secara acak (1-12)
    gameData.differenceZone = Math.floor(Math.random() * 12) + 1;
    // Tetapkan tipe perbedaan sebagai 'color'
    gameData.differenceType = 'color';
    // Reset warna perbedaan
    gameData.differenceColor = null;
    gameData.isGameActive = true;
    
    // Buat partikel yang sinkron
    generateParticles();
    
    // Gambar radar
    drawRadar();
    
    // Mulai animasi radar
    startRadarAnimation();
    
    console.log('Perbedaan berada di zona:', gameData.differenceZone, 'Tipe perbedaan:', gameData.differenceType);
}

// Membuat partikel yang sinkron untuk kedua radar
function generateParticles() {
    gameData.particles = [];
    gameData.differenceParticleIndex = -1;
    const particleCount = 100;
    const minDistance = 30; // Jarak minimum antar partikel yang lebih besar
    
    // Fungsi untuk memeriksa apakah posisi partikel terlalu dekat dengan zona transisi
    function isInTransitionZone(angle) {
        // Hindari area pertengahan antara zona (15 derajad di sekitar batas zona)
        const zoneBoundaries = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
        for (let boundary of zoneBoundaries) {
            const diff = Math.abs(angle - boundary);
            const diffAlt = Math.abs(angle - (boundary + 360)); // Untuk sudut 360
            if (diff < 15 || diffAlt < 15) {
                return true;
            }
        }
        return false;
    }
    
    // Fungsi untuk memeriksa apakah posisi partikel terlalu dekat dengan partikel lain
    function isTooClose(x, y, particles) {
        for (let particle of particles) {
            const dx = particle.x - x;
            const dy = particle.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < minDistance) {
                return true;
            }
        }
        return false;
    }
    
    // Daftar warna yang tersedia
    const colors = ['#00ff9d', '#00eeff', '#bb86fc', '#03dac6', '#ff6b6b', '#ffd166'];
    
    // Buat partikel dengan penempatan yang lebih baik
    for (let i = 0; i < particleCount; i++) {
        let x, y, angle, distance;
        let attempts = 0;
        const maxAttempts = 200; // Batas percobaan yang lebih tinggi untuk menghindari loop tak terbatas
        
        // Cari posisi yang tidak tumpang tindih dan tidak di zona transisi
        do {
            // Hitung sudut acak dalam derajad
            angle = Math.random() * 360;
            // Hitung jarak dari pusat (dengan variasi)
            distance = 50 + Math.random() * (RADIUS - 70);
            
            // Hitung posisi x dan y
            const radianAngle = angle * Math.PI / 180;
            x = CENTER_X + Math.cos(radianAngle) * distance;
            y = CENTER_Y + Math.sin(radianAngle) * distance;
            
            attempts++;
        } while (
            (isTooClose(x, y, gameData.particles) || isInTransitionZone(angle)) && 
            attempts < maxAttempts
        );
        
        // Jika sudah mencoba terlalu banyak, gunakan posisi terakhir (mencegah loop tak terbatas)
        if (attempts >= maxAttempts) {
            // Coba sekali lagi dengan jarak minimum
            distance = 50 + Math.random() * (RADIUS - 70);
            const radianAngle = angle * Math.PI / 180;
            x = CENTER_X + Math.cos(radianAngle) * distance;
            y = CENTER_Y + Math.sin(radianAngle) * distance;
        }
        
        // Tentukan ukuran partikel
        const size = 3 + Math.random() * 3; // Ukuran yang sedikit lebih besar untuk visibilitas
        
        // Tentukan warna partikel secara acak
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Tambahkan partikel ke array
        gameData.particles.push({
            x: x,
            y: y,
            size: size,
            color: color,
            isDifference: false,
            angle: angle // Simpan sudut untuk referensi
        });
    }
    
    // Pilih satu partikel untuk menjadi perbedaan
    if (gameData.particles.length > 0) {
        gameData.differenceParticleIndex = Math.floor(Math.random() * gameData.particles.length);
        gameData.particles[gameData.differenceParticleIndex].isDifference = true;
        
        // Untuk perbedaan berupa penambahan partikel, kita tidak perlu memodifikasi partikel yang ada
        // Partikel tambahan akan ditambahkan saat menggambar di radar kanan
    }
}

// Menggambar radar
function drawRadar() {
    // Bersihkan canvas
    ctxLeft.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctxRight.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctxLeftMask.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctxRightMask.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Gambar latar belakang radar
    drawRadarBackground(ctxLeft);
    drawRadarBackground(ctxRight);
    
    // Gambar partikel
    drawParticles(ctxLeft, false);
    drawParticles(ctxRight, true);
    
    // Gambar topeng gelap dengan celah transparan
    drawRadarMask(ctxLeftMask);
    drawRadarMask(ctxRightMask);
}

// Menggambar latar belakang radar
function drawRadarBackground(ctx) {
    // Gambar lingkaran luar
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, RADIUS, 0, Math.PI * 2);
    ctx.strokeStyle = '#bb86fc';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Gambar lingkaran dalam
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, RADIUS * 0.7, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(187, 134, 252, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, RADIUS * 0.4, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(187, 134, 252, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Gambar garis-garis radar (12 zona)
    for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI / 6) - Math.PI/2;
        const x1 = CENTER_X + Math.cos(angle) * 40;
        const y1 = CENTER_Y + Math.sin(angle) * 40;
        const x2 = CENTER_X + Math.cos(angle) * RADIUS;
        const y2 = CENTER_Y + Math.sin(angle) * RADIUS;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'rgba(187, 134, 252, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

// Menggambar partikel
function drawParticles(ctx, isRightRadar) {
    // Gambar semua partikel
    gameData.particles.forEach((particle, index) => {
        let size = particle.size;
        let color = particle.color;
        
        // Gambar partikel
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        
        // Tambahkan glow effect
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
    });
    
    // Jika ini radar kanan dan ada partikel perbedaan, tambahkan partikel baru dengan warna berbeda
    if (isRightRadar && gameData.differenceParticleIndex !== -1 && gameData.particles.length > 0) {
        const differenceParticle = gameData.particles[gameData.differenceParticleIndex];
        
        // Daftar warna yang tersedia
        const colors = ['#00ff9d', '#00eeff', '#bb86fc', '#03dac6', '#ff6b6b', '#ffd166'];
        
        // Pilih warna yang berbeda dari warna partikel asli
        let newColor;
        do {
            newColor = colors[Math.floor(Math.random() * colors.length)];
        } while (newColor === differenceParticle.color);
        
        // Simpan warna perbedaan di objek gameData agar konsisten
        if (!gameData.differenceColor) {
            gameData.differenceColor = newColor;
        }
        
        // Gambar partikel tambahan dengan warna berbeda
        ctx.beginPath();
        ctx.arc(differenceParticle.x, differenceParticle.y, differenceParticle.size, 0, Math.PI * 2);
        ctx.fillStyle = gameData.differenceColor;
        ctx.fill();
        
        // Tambahkan glow effect untuk partikel tambahan
        ctx.shadowColor = gameData.differenceColor;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Memulai animasi radar
function startRadarAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    
    beamAngle = 0;
    animateRadar();
}

// Animasi radar
function animateRadar() {
    // Bersihkan canvas
    ctxLeft.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctxRight.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctxLeftMask.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctxRightMask.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Gambar latar belakang radar
    drawRadarBackground(ctxLeft);
    drawRadarBackground(ctxRight);
    
    // Gambar partikel
    drawParticles(ctxLeft, false);
    drawParticles(ctxRight, true);
    
    // Gambar topeng gelap dengan celah transparan
    drawRadarMask(ctxLeftMask);
    drawRadarMask(ctxRightMask);
    
    // Update beam angle
    beamAngle += BEAM_SPEED;
    if (beamAngle > Math.PI * 2) {
        beamAngle = 0;
    }
    
    // Lanjutkan animasi
    animationId = requestAnimationFrame(animateRadar);
}



// Menangani tebakan pemain
function handleGuess() {
    if (!gameData.isGameActive) return;
    
    const guess = parseInt(answerZoneInput.value);
    
    if (isNaN(guess) || guess < 1 || guess > 12) {
        resultMessage.textContent = 'Masukkan angka antara 1 dan 12!';
        resultMessage.className = 'incorrect';
        return;
    }
    
    // Nonaktifkan input dan tombol selama proses
    answerZoneInput.disabled = true;
    guessButton.disabled = true;
    
    // Hitung zona perbedaan berdasarkan sudut partikel
    const differenceZone = calculateDifferenceZone();
    
    // Tentukan pesan berdasarkan tipe perbedaan
    let differenceMessage = '';
    if (gameData.differenceType === 'size') {
        differenceMessage = 'Perbedaan berupa ukuran partikel.';
    } else {
        differenceMessage = 'Perbedaan berupa warna partikel.';
    }
    
    // Periksa jawaban
    if (guess === differenceZone) {
        resultMessage.textContent = 'Benar! 🎉 ' + differenceMessage;
        resultMessage.className = 'correct';
        
        // Update statistik pemain
        currentPlayer.wins++;
    } else {
        resultMessage.textContent = `Salah. 😟 Perbedaan berada di zona ${differenceZone}. ${differenceMessage}`;
        resultMessage.className = 'incorrect';
    }
    
    // Update statistik pemain
    currentPlayer.gamesPlayed++;
    localStorage.setItem('currentRadarPlayer', JSON.stringify(currentPlayer));
    
    // Update daftar pemain
    const playerIndex = players.findIndex(p => p.name === currentPlayer.name);
    if (playerIndex !== -1) {
        players[playerIndex] = currentPlayer;
        saveLeaderboard();
    }
    
    // Update info pemain di UI
    winsCount.textContent = currentPlayer.wins;
    gamesCount.textContent = currentPlayer.gamesPlayed;
    
    // Tampilkan tombol untuk permainan berikutnya
    nextGameButton.classList.remove('hidden');
    gameData.isGameActive = false;
}

// Menggambar topeng gelap dengan celah transparan
function drawRadarMask(ctx) {
    // Gambar latar belakang gelap
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Gambar celah transparan berbentuk irisan pizza
    ctx.save();
    ctx.translate(CENTER_X, CENTER_Y);
    ctx.rotate(beamAngle);
    
    // Buat jalur untuk celah irisan pizza
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(RADIUS, -RADIUS * 0.3);
    ctx.arc(0, 0, RADIUS, -0.3, 0.3);
    ctx.closePath();
    
    // Hapus area celah (membuat transparan)
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fill();
    
    ctx.restore();
    ctx.globalCompositeOperation = 'source-over';
}

// Menghitung zona perbedaan berdasarkan sudut partikel
function calculateDifferenceZone() {
    // Gunakan indeks partikel perbedaan yang sudah ditentukan
    if (gameData.differenceParticleIndex === -1 || gameData.particles.length === 0) {
        return gameData.differenceZone; // Gunakan zona yang dipilih secara acak jika tidak ada partikel perbedaan
    }
    
    const differenceParticle = gameData.particles[gameData.differenceParticleIndex];
    if (!differenceParticle) return gameData.differenceZone;
    
    // Gunakan sudut yang sudah dihitung saat pembuatan partikel
    let angle = differenceParticle.angle;
    
    // Normalisasi sudut ke 0-360
    angle = angle % 360;
    if (angle < 0) angle += 360;
    
    // Konversi ke zona 1-12
    // Zona 1 = 0-30 derajat, Zona 2 = 30-60 derajat, dst.
    // Zona 12 = 330-360 derajat
    // Karena label dimulai dari 12 di atas (90 derajat), kita perlu menyesuaikan perhitungan
    // Sudut 0 derajat = Zona 3, Sudut 90 derajat = Zona 12, Sudut 180 derajat = Zona 9, Sudut 270 derajat = Zona 6
    const adjustedAngle = (angle + 90) % 360; // Geser sudut agar 12 berada di atas
    let zone = Math.floor(adjustedAngle / 30) + 1;
    
    // Jika zone > 12, kembali ke 1 (karena zona 12 adalah 330-360 derajat)
    if (zone > 12) zone = 1;
    if (zone < 1) zone = 12;
    
    console.log('Sudut partikel:', angle, 'Adjusted angle:', adjustedAngle, 'Zona:', zone);
    
    return zone;
}