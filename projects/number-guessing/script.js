// Variabel global permainan
let currentPlayer = null;
let secretNumber = '';
let attempts = 0;
let maxAttempts = 10;
let gameOver = false;

// DOM Elements
const registrationPage = document.getElementById('registration-page');
const gamePage = document.getElementById('game-page');
const registrationForm = document.getElementById('registration-form');
const playerNameInput = document.getElementById('player-name');
const errorMessage = document.getElementById('error-message');
const guessInput = document.getElementById('guess-input');
const submitGuessBtn = document.getElementById('submit-guess');
const guessHistory = document.getElementById('guess-history');
const attemptCount = document.getElementById('attempt-count');
const gamePlayerName = document.getElementById('game-player-name');
const gameResult = document.getElementById('game-result');
const resultTitle = document.getElementById('result-title');
const resultText = document.getElementById('result-text');
const playAgainBtn = document.getElementById('play-again');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Event listener untuk formulir pendaftaran
    registrationForm.addEventListener('submit', handleRegistration);
    
    // Event listener untuk tombol submit tebakan
    submitGuessBtn.addEventListener('click', handleGuess);
    
    // Event listener untuk input tebakan (agar bisa Enter)
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleGuess();
        }
    });
    
    // Event listener untuk tombol main lagi
    playAgainBtn.addEventListener('click', resetGame);
    
    // Validasi input hanya angka dan panjang 4 digit
    guessInput.addEventListener('input', function() {
        // Hapus karakter non-digit
        this.value = this.value.replace(/[^0-9]/g, '');
        
        // Batasi hanya 4 digit
        if (this.value.length > 4) {
            this.value = this.value.substring(0, 4);
        }
    });
});

// Fungsi untuk menangani pendaftaran pemain
function handleRegistration(e) {
    e.preventDefault();
    const playerName = playerNameInput.value.trim();
    
    if (!playerName) {
        showError('Nama pemain harus diisi!');
        return;
    }
    
    currentPlayer = playerName;
    localStorage.setItem('numberGuessingPlayer', JSON.stringify({
        name: playerName,
        lastPlayed: new Date().toISOString()
    }));
    
    showGamePage();
    startNewGame();
}

// Fungsi untuk menampilkan halaman permainan
function showGamePage() {
    registrationPage.classList.add('hidden');
    gamePage.classList.remove('hidden');
    gamePlayerName.textContent = currentPlayer;
}

// Fungsi untuk memulai permainan baru
function startNewGame() {
    secretNumber = generateSecretNumber();
    attempts = 0;
    gameOver = false;

    // Reset tampilan
    const tableBody = document.getElementById('history-table-body');
    if (tableBody) {
        tableBody.innerHTML = '';
    }
    attemptCount.textContent = attempts + 1;
    gameResult.classList.add('hidden');
    guessInput.value = '';
    guessInput.disabled = false;
    submitGuessBtn.disabled = false;

    console.log(`Angka rahasia (untuk debugging): ${secretNumber}`);
}

// Fungsi untuk menghasilkan angka rahasia 4 digit unik
function generateSecretNumber() {
    let digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let result = '';
    
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        result += digits[randomIndex];
        digits.splice(randomIndex, 1); // Hapus digit agar tidak duplikat
    }
    
    return result;
}

// Fungsi untuk menangani tebakan pemain
function handleGuess() {
    if (gameOver) return;
    
    const playerGuess = guessInput.value.trim();
    
    // Validasi tebakan
    if (!validateGuess(playerGuess)) {
        return;
    }
    
    attempts++;
    attemptCount.textContent = attempts;
    
    // Hitung angka benar (A) dan posisi benar (P)
    const { correctDigits, correctPositions } = calculateCorrectDigitsAndPositions(playerGuess, secretNumber);

    // Tambahkan ke riwayat
    addToHistory(playerGuess, correctDigits, correctPositions);

    // Periksa apakah pemain menang (semua angka benar dan semua posisi benar)
    if (correctDigits === 4 && correctPositions === 4) {
        endGame(true);
        return;
    }
    
    // Periksa apakah sudah mencapai batas percobaan
    if (attempts >= maxAttempts) {
        endGame(false);
        return;
    }
    
    // Bersihkan input untuk tebakan berikutnya
    guessInput.value = '';
    guessInput.focus();
}

// Fungsi untuk memvalidasi tebakan
function validateGuess(guess) {
    // Pastikan panjangnya 4 digit
    if (guess.length !== 4) {
        showError('Tebakan harus 4 digit!');
        return false;
    }
    
    // Pastikan semua karakter adalah angka
    if (!/^\d+$/.test(guess)) {
        showError('Tebakan hanya boleh berisi angka!');
        return false;
    }
    
    // Pastikan tidak ada digit duplikat
    if (hasDuplicateDigits(guess)) {
        showError('Tebakan tidak boleh memiliki digit duplikat!');
        return false;
    }
    
    // Bersihkan pesan error sebelumnya
    hideError();
    return true;
}

// Fungsi untuk memeriksa apakah ada digit duplikat
function hasDuplicateDigits(str) {
    const digits = str.split('');
    return digits.some((digit, index) => digits.indexOf(digit) !== index);
}

// Fungsi untuk menghitung angka benar (A) dan posisi benar (P)
function calculateCorrectDigitsAndPositions(guess, secret) {
    let correctPositions = 0;  // P: posisi benar
    let correctDigits = 0;     // A: angka benar

    // Hitung posisi benar (P)
    for (let i = 0; i < guess.length; i++) {
        if (guess[i] === secret[i]) {
            correctPositions++;
        }
    }

    // Hitung angka benar (A) - termasuk yang di posisi benar dan salah
    // Buat array dari digit rahasia
    let secretDigits = secret.split('');

    // Untuk setiap digit dalam tebakan
    for (let i = 0; i < guess.length; i++) {
        let digit = guess[i];
        // Cek apakah digit ini ada di angka rahasia
        let index = secretDigits.indexOf(digit);
        if (index !== -1) {
            correctDigits++;
            // Hapus digit dari secretDigits agar tidak dihitung ganda
            secretDigits[index] = null;
        }
    }

    return { correctDigits, correctPositions };
}

// Fungsi untuk menambahkan tebakan ke riwayat
function addToHistory(guess, correctDigits, correctPositions) {
    const tableBody = document.getElementById('history-table-body');
    const noEntriesMessage = document.getElementById('no-entries-message');

    const row = document.createElement('tr');
    row.className = 'history-row';

    const guessCell = document.createElement('td');
    guessCell.textContent = guess;
    guessCell.className = 'guess-number';

    const digitsCell = document.createElement('td');
    digitsCell.textContent = correctDigits;
    digitsCell.className = 'correct-digits';

    const positionsCell = document.createElement('td');
    positionsCell.textContent = correctPositions;
    positionsCell.className = 'correct-positions';

    row.appendChild(guessCell);
    row.appendChild(digitsCell);
    row.appendChild(positionsCell);

    tableBody.insertBefore(row, tableBody.firstChild);

    // Sembunyikan pesan "belum ada tebakan" setelah tebakan pertama
    if (noEntriesMessage) {
        noEntriesMessage.style.display = 'none';
    }
}

// Fungsi untuk menyelesaikan permainan
function endGame(isWin) {
    gameOver = true;
    guessInput.disabled = true;
    submitGuessBtn.disabled = true;
    
    if (isWin) {
        resultTitle.textContent = '🎉 Selamat!';
        resultText.textContent = `Anda berhasil menebak angka ${secretNumber} dalam ${attempts} percobaan!`;
    } else {
        resultTitle.textContent = '😅 Game Over!';
        resultText.textContent = `Anda gagal menebak dalam ${maxAttempts} percobaan. Angka rahasia adalah ${secretNumber}.`;
    }
    
    gameResult.classList.remove('hidden');
}

// Fungsi untuk mengatur ulang permainan
function resetGame() {
    startNewGame();
    gameResult.classList.add('hidden');

    // Kosongkan riwayat tebakan
    const tableBody = document.getElementById('history-table-body');
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    // Tampilkan kembali pesan "belum ada tebakan"
    const noEntriesMessage = document.getElementById('no-entries-message');
    if (noEntriesMessage) {
        noEntriesMessage.style.display = 'block';
    }
}

// Fungsi untuk menampilkan pesan error
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    // Hilangkan pesan otomatis setelah 3 detik
    setTimeout(hideError, 3000);
}

// Fungsi untuk menyembunyikan pesan error
function hideError() {
    errorMessage.style.display = 'none';
}