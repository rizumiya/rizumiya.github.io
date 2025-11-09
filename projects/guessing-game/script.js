// Data pemain dan konfigurasi permainan
let currentPlayer = null;
let currentScore = 0;
let currentCategory = null;
let currentLevel = null;
let currentWord = null;
let currentHints = [];
let usedHints = [];
let revealedLetters = [];
let incorrectGuesses = 0;
let gameActive = false;
let questionsData = null;
let completedQuestions = {}; // Untuk melacak soal yang telah diselesaikan per kategori dan level
let levelAccessed = {}; // Untuk melacak level mana yang telah diakses di setiap kategori

// DOM Elements
const registrationPage = document.getElementById('registration-page');
const categoryPage = document.getElementById('category-page');
const gamePage = document.getElementById('game-page');
const resultPage = document.getElementById('result-page');
const registrationForm = document.getElementById('registration-form');
const playerNameInput = document.getElementById('player-name');
const playerNameDisplay = document.getElementById('player-name-display');
const gamePlayerName = document.getElementById('game-player-name');
const currentCategoryDisplay = document.getElementById('current-category');
const currentLevelDisplay = document.getElementById('current-level');
const wordDisplay = document.getElementById('word-display');
const errorDisplay = document.getElementById('error-display');
const guessInput = document.getElementById('guess-input');
const submitGuessBtn = document.getElementById('submit-guess');
const useHintBtn = document.getElementById('use-hint');
const currentHint = document.getElementById('current-hint');
const hintsUsed = document.getElementById('hints-used');
const gameScore = document.getElementById('game-score');
const maxScoreDisplay = document.getElementById('max-score');
const hintPenaltyDisplay = document.getElementById('hint-penalty');
const availableHintsDisplay = document.getElementById('available-hints');
const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');
const resultPoints = document.getElementById('result-points');
const totalScore = document.getElementById('total-score');
const welcomeMessage = document.getElementById('welcome-message');
const currentScoreDisplay = document.getElementById('current-score');
const startGameBtn = document.getElementById('start-game');

// Inisialisasi kategori
let categories = {};

// Load data soal dari data langsung (tidak dari JSON)
async function loadQuestions() {
    // Gunakan data langsung tanpa mengambil dari file JSON
    categories = {
        "hewan": [
            {
                "word": "KUCING",
                "hints": [
                    "Menghabiskan 70% hidupnya hanya untuk tidur",
                    "Tidak bisa merasakan rasa manis di lidahnya",
                    "Memiliki bantalan empuk di telapak kakinya",
                    "Telinganya bisa diputar 180 derajat",
                    "Hewan peliharaan yang bermusuhan dengan tikus"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ANJING",
                "hints": [
                    "Penciumannya ribuan kali lebih tajam dari manusia",
                    "Dikenal sebagai sahabat terbaik manusia",
                    "Memiliki beragam jenis ras dari kecil hingga besar",
                    "Sering menjulurkan lidah untuk mendinginkan tubuh",
                    "Menggoyangkan ekor saat merasa senang"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KELINCI",
                "hints": [
                    "Gigi depannya tidak pernah berhenti tumbuh",
                    "Memakan kotoran khususnya sendiri untuk nutrisi ekstra",
                    "Memiliki telinga panjang yang khas",
                    "Bergerak dengan cara melompat",
                    "Sangat identik dengan makanan wortel"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "MONYET",
                "hints": [
                    "Sangat cerdas dan hidup berkelompok",
                    "Menggunakan ekor untuk keseimbangan di pohon",
                    "Memiliki DNA yang mirip dengan manusia",
                    "Suka menggaruk tubuhnya dan mencari kutu",
                    "Identik dengan buah pisang"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "GAJAH",
                "hints": [
                    "Satu-satunya mamalia yang tidak bisa melompat",
                    "Memiliki ingatan yang sangat kuat",
                    "Menggunakan telinga lebar untuk mengusir panas",
                    "Memiliki hidung yang sangat panjang",
                    "Hewan darat terbesar yang masih hidup"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "JERAPAH",
                "hints": [
                    "Tidur hanya sekitar 30 menit sehari",
                    "Memiliki lidah berwarna biru gelap",
                    "Jantungnya sangat besar untuk memompa darah ke kepala",
                    "Hewan tertinggi di dunia",
                    "Lehernya sangat panjang untuk meraih daun tinggi"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ZEBRA",
                "hints": [
                    "Sebenarnya berkulit hitam dengan belang putih",
                    "Pola belangnya unik seperti sidik jari manusia",
                    "Tidur sambil berdiri",
                    "Hidup di padang rumput Afrika",
                    "Terlihat seperti kuda yang memakai piyama"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BUAYA",
                "hints": [
                    "Memiliki gigitan terkuat di dunia hewan saat ini",
                    "Sering membuka mulut lebar untuk mendinginkan tubuh",
                    "Reptil purba yang hidup di dua alam",
                    "Berkulit sangat keras dan bersisik",
                    "Dikenal dengan istilah 'air mata' palsu"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "HARIMAU",
                "hints": [
                    "Kucing terbesar di dunia",
                    "Berbeda dengan kucing lain, dia suka berenang",
                    "Memiliki motif loreng untuk kamuflase",
                    "Hewan soliter (suka menyendiri)",
                    "Aumannya bisa terdengar hingga 3 km"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SINGA",
                "hints": [
                    "Jantannya memiliki rambut tebal di sekitar leher",
                    "Hidup dalam kelompok keluarga (pride)",
                    "Betina yang lebih aktif berburu daripada jantan",
                    "Dijuluki sebagai si raja hutan",
                    "Sering terlihat tidur malas di siang hari"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PENYU",
                "hints": [
                    "Sering kembali ke pantai tempat ia menetas untuk bertelur",
                    "Jenis kelamin bayi ditentukan oleh suhu pasir",
                    "Reptil laut yang memiliki tempurung",
                    "Memakan ubur-ubur di laut",
                    "Bergerak sangat lambat saat di daratan"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KATAK",
                "hints": [
                    "Memulai hidupnya di air sebagai berudu",
                    "Bernapas menggunakan paru-paru dan kulit basah",
                    "Memiliki lidah panjang yang lengket",
                    "Suka bersuara nyaring setelah hujan",
                    "Hewan amfibi yang pandai melompat"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "NYAMUK",
                "hints": [
                    "Hanya betina yang mencari darah untuk telurnya",
                    "Tertarik pada bau keringat dan karbon dioksida",
                    "Serangga paling mematikan karena menyebar penyakit",
                    "Suara dengingnya sangat mengganggu di telinga",
                    "Gigitannya menyebabkan bentol gatal"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "LALAT",
                "hints": [
                    "Merasakan makanan menggunakan kakinya",
                    "Memiliki mata majemuk yang besar",
                    "Sering terlihat menggosok-gosokkan tangan depannya",
                    "Serangga yang identik dengan tempat kotor",
                    "Suka hinggap di makanan yang terbuka"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "TIKUS",
                "hints": [
                    "Gigi serinya terus tumbuh sehingga harus sering mengerat",
                    "Sangat cerdas dan bisa mempelajari rute rumit",
                    "Hewan pengerat yang hidup di selokan atau rumah",
                    "Menjadi musuh alami kucing",
                    "Suka mencuri makanan di dapur"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SEMUT",
                "hints": [
                    "Bisa mengangkat beban 50 kali berat tubuhnya",
                    "Hidup dalam koloni yang sangat teratur",
                    "Tidak memiliki paru-paru",
                    "Suka sekali dengan makanan manis",
                    "Selalu berjalan berbaris dengan rapi"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "DOMBA",
                "hints": [
                    "Dikenal karena bulunya yang tebal dan keriting",
                    "Hidup bergerombol di peternakan",
                    "Sering dijadikan simbol hewan penurut",
                    "Menghasilkan bahan dasar benang wol",
                    "Suaranya mengembik"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KERBAU",
                "hints": [
                    "Suka berkubang di lumpur untuk mendinginkan tubuh",
                    "Memiliki tanduk besar yang melengkung",
                    "Sering membantu petani membajak sawah",
                    "Hewan ternak yang sangat kuat",
                    "Mirip sapi tapi berkulit lebih gelap"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KUPU-KUPU",
                "hints": [
                    "Merasakan rasa dengan kakinya",
                    "Dulunya adalah ulat yang rakus",
                    "Mengalami metamorfosis sempurna",
                    "Memiliki sayap dengan motif indah",
                    "Suka menghisap nektar bunga"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BEBEK",
                "hints": [
                    "Bulunya dilapisi minyak agar tidak basah di air",
                    "Kakinya berselaput untuk berenang",
                    "Berjalan dengan cara megal-megol yang lucu",
                    "Sering berbaris saat berjalan mengikuti induknya",
                    "Suaranya kwek-kwek"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KALELAWAR",
                "hints": [
                    "Satu-satunya mamalia yang bisa terbang sejati",
                    "Menggunakan pantulan suara (ekolokasi) untuk navigasi",
                    "Tidur dengan posisi terbalik menggantung",
                    "Aktif mencari makan di malam hari",
                    "Tinggal di dalam gua yang gelap"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "LUMBA-LUMBA",
                "hints": [
                    "Tidur dengan satu mata terbuka",
                    "Mamalia laut yang sangat cerdas",
                    "Bernapas menggunakan lubang di atas kepalanya",
                    "Sering melompat ke permukaan air",
                    "Dikenal suka menolong manusia di laut"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PENGUIN",
                "hints": [
                    "Burung yang tidak bisa terbang tapi perenang handal",
                    "Hidup di daerah kutub yang sangat dingin",
                    "Jantannya yang mengerami telur di kakinya",
                    "Berjalan dengan tegak dan lucu",
                    "Memiliki warna seperti memakai jas tuksedo"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KANGGURU",
                "hints": [
                    "Tidak bisa berjalan mundur",
                    "Bayinya tinggal di dalam kantung induknya",
                    "Menggunakan ekor kuatnya sebagai kaki ketiga saat diam",
                    "Hewan ikonik dari benua Australia",
                    "Bergerak dengan cara melompat jauh"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "UNTA",
                "hints": [
                    "Bisa minum 100 liter air dalam sekali waktu",
                    "Punuknya berisi cadangan lemak, bukan air",
                    "Memiliki tiga kelopak mata untuk melindungi dari pasir",
                    "Kendaraan utama di padang gurun",
                    "Tahan tidak minum berhari-hari"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BERUANG",
                "hints": [
                    "Mengalami hibernasi (tidur panjang) saat musim dingin",
                    "Terlihat lambat tapi bisa berlari sangat kencang",
                    "Sangat menyukai madu dan ikan salmon",
                    "Memiliki cakar yang sangat kuat",
                    "Tubuhnya besar dan berbulu tebal"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "LANDAK",
                "hints": [
                    "Memiliki ribuan duri di punggungnya",
                    "Saat terancam akan menggulung tubuhnya seperti bola",
                    "Sebenarnya tidak bisa menembakkan durinya",
                    "Hewan nokturnal pemakan serangga",
                    "Duri tersebut sebenarnya adalah rambut yang mengeras"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KUDANIL",
                "hints": [
                    "Menghasilkan keringat berwarna merah muda",
                    "Salah satu hewan paling berbahaya di Afrika",
                    "Bisa menahan napas di dalam air hingga 5 menit",
                    "Memiliki mulut yang bisa terbuka sangat lebar",
                    "Menghabiskan sebagian besar waktunya berendam"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BADAK",
                "hints": [
                    "Kulitnya sangat tebal seperti baju zirah",
                    "Memiliki penglihatan yang buruk tapi penciuman tajam",
                    "Diburú karena culanya yang berharga mahal",
                    "Ada jenis yang bercula satu dan dua",
                    "Hewan berbadan besar yang terancam punah"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "GURITA",
                "hints": [
                    "Memiliki tiga jantung dan berdarah biru",
                    "Sangat cerdas, bisa membuka toples",
                    "Mampu mengubah warna kulitnya dengan instan",
                    "Menyemprotkan tinta hitam saat terancam",
                    "Memiliki delapan lengan berotot"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "UDANG",
                "hints": [
                    "Jantungnya terletak di kepalanya",
                    "Berenang mundur dengan cepat saat kaget",
                    "Kulitnya berubah merah saat dimasak",
                    "Memiliki antena yang panjang",
                    "Hewan laut krustasea yang populer dimakan"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KEPITING",
                "hints": [
                    "Berjalan dengan cara menyamping",
                    "Memiliki sepasang capit yang kuat",
                    "Cangkangnya keras untuk melindungi tubuh",
                    "Bisa hidup di air laut maupun air tawar",
                    "Tuan Krabs di kartun Spongebob"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ULAT",
                "hints": [
                    "Memiliki tubuh lunak dan bersegmen",
                    "Fase remaja sebelum menjadi kupu-kupu atau ngengat",
                    "Sangat rakus memakan dedaunan",
                    "Beberapa jenisnya bisa menyebabkan gatal",
                    "Bergerak dengan cara melata"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "CAPUNG",
                "hints": [
                    "Bisa terbang maju, mundur, dan diam di tempat (hover)",
                    "Memiliki mata majemuk yang mencakup hampir seluruh kepala",
                    "Predator nyamuk yang efektif",
                    "Fase larvanya hidup di dalam air",
                    "Memiliki sayap transparan yang panjang"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "TUPAI",
                "hints": [
                    "Sering lupa dimana ia mengubur makanannya",
                    "Membantu reboisasi hutan secara tidak sengaja",
                    "Sangat lincah melompat antar dahan pohon",
                    "Memiliki ekor yang lebat dan panjang",
                    "Sangat menyukai kacang-kacangan"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "RUBAH",
                "hints": [
                    "Menggunakan medan magnet bumi untuk berburu",
                    "Hewan soliter yang cerdik",
                    "Memiliki telinga besar dan moncong lancip",
                    "Sering muncul dalam dongeng sebagai karakter licik",
                    "Mirip anjing tapi berekor lebih tebal"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SERIGALA",
                "hints": [
                    "Nenek moyang dari semua ras anjing modern",
                    "Hidup dan berburu dalam kawanan yang terorganisir",
                    "Melolong ke arah bulan untuk komunikasi",
                    "Pemimpin kawanannya disebut Alpha",
                    "Predator puncak di habitatnya"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BURUNG HANTU",
                "hints": [
                    "Bisa memutar kepalanya hingga 270 derajat",
                    "Terbang nyaris tanpa suara",
                    "Aktif berburu di malam hari",
                    "Matanya besar dan menghadap ke depan",
                    "Simbol kebijaksanaan di banyak budaya"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "MERPATI",
                "hints": [
                    "Dahulu digunakan untuk mengantar surat",
                    "Bisa menemukan jalan pulang dari jarak yang sangat jauh",
                    "Simbol perdamaian dunia",
                    "Sering terlihat bergerombol di taman kota",
                    "Hidup berpasangan seumur hidup (monogami)"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "LEBAH",
                "hints": [
                    "Berkomunikasi dengan cara 'menari'",
                    "Mati setelah menyengat manusia (untuk jenis tertentu)",
                    "Sangat penting untuk penyerbukan bunga",
                    "Hidup dalam koloni dengan satu ratu",
                    "Penghasil madu"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PLATIPUS",
                "hints": [
                    "Mamalia aneh yang bertelur",
                    "Memiliki paruh seperti bebek dan kaki berselaput",
                    "Pejantannya memiliki taji beracun di kaki belakang",
                    "Hewan asli Australia",
                    "Menyusui anaknya tanpa puting susu (lewat pori-pori kulit)"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "TARSIUS",
                "hints": [
                    "Ukuran matanya lebih besar dari otaknya",
                    "Kepalanya bisa berputar 180 derajat ke belakang",
                    "Primata terkecil di dunia dari Sulawesi",
                    "Stres berat jika dipegang manusia dan bisa mati",
                    "Aktif melompat di pohon saat malam hari"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "UNDUR-UNDUR",
                "hints": [
                    "Berjalan mundur saat menggali di pasir",
                    "Membuat jebakan berbentuk corong untuk mangsa",
                    "Sebenarnya adalah larva dari serangga antlion",
                    "Tidak memiliki lubang pembuangan selama fase larva",
                    "Hidup di tanah berpasir halus yang kering"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KUKANG",
                "hints": [
                    "Satu-satunya primata yang berbisa (racun di siku)",
                    "Bergerak sangat lambat untuk menghindari deteksi predator",
                    "Sering dikira hewan malas padahal itu strategi bertahan",
                    "Memiliki mata bulat besar yang reflektif di malam hari",
                    "Hewan dilindungi yang sering diperdagangkan ilegal"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "TRENGGILING",
                "hints": [
                    "Tubuhnya dilapisi sisik keras dari keratin",
                    "Menggulung diri menjadi bola keras saat terancam",
                    "Hewan mamalia yang paling banyak diselundupkan di dunia",
                    "Memiliki lidah yang lebih panjang dari tubuhnya",
                    "Pemakan semut dan rayap"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "WALRUS",
                "hints": [
                    "Memiliki dua gading panjang yang turun ke bawah",
                    "Mamalia laut besar yang hidup di Arktik (kutub utara)",
                    "Berkumis tebal dan kaku",
                    "Kulitnya sangat tebal dan berlemak",
                    "Gadingnya digunakan untuk menarik tubuhnya ke atas es"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KOMODO",
                "hints": [
                    "Kadal terbesar di dunia yang masih hidup",
                    "Memiliki air liur yang penuh bakteri mematikan",
                    "Hewan endemik yang hanya ada di Indonesia",
                    "Bisa mencium bau bangkai dari jarak kilometer",
                    "Kanibal, terkadang memakan anaknya sendiri yang baru menetas"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ANOA",
                "hints": [
                    "Sering disebut sebagai kerbau kerdil",
                    "Hewan endemik dari pulau Sulawesi",
                    "Memiliki sepasang tanduk lurus runcing ke belakang",
                    "Hidup soliter di hutan lebat",
                    "Termasuk hewan yang terancam punah"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BEKANTAN",
                "hints": [
                    "Monyet dengan hidung yang besar dan panjang",
                    "Hidung besar hanya dimiliki oleh pejantan",
                    "Hewan endemik pulau Kalimantan",
                    "Perenang yang handal di hutan bakau",
                    "Menjadi maskot taman hiburan Dufan"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "DUGONG",
                "hints": [
                    "Mamalia laut yang menjadi inspirasi legenda putri duyung",
                    "Vegetarian sejati, hanya memakan lamun (rumput laut)",
                    "Berenang sangat lambat di perairan dangkal",
                    "Berkerabat dekat dengan gajah secara evolusi",
                    "Sering disebut sapi laut"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ARMADILO",
                "hints": [
                    "Memiliki cangkang pelindung alami dari kulit bertulang",
                    "Bisa melompat vertikal saat kaget",
                    "Berasal dari benua Amerika",
                    "Menggulung jadi bola sempurna saat diserang",
                    "Penggali tanah yang handal"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KASUARI",
                "hints": [
                    "Burung paling berbahaya di dunia",
                    "Memiliki cakar tengah yang tajam seperti pisau",
                    "Memiliki gelambir biru dan 'helm' di kepalanya",
                    "Tidak bisa terbang, hidup di Papua dan Australia",
                    "Larinya sangat cepat meski bertubuh besar"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "CENDRAWASIH",
                "hints": [
                    "Dijuluki sebagai burung dari surga (Bird of Paradise)",
                    "Jantannya melakukan tarian rumit untuk memikat betina",
                    "Memiliki bulu yang sangat indah dan berwarna-warni",
                    "Berasal dari hutan Papua",
                    "Bulu indahnya pernah jadi komoditas perdagangan mahal"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KUSKUS",
                "hints": [
                    "Hewan berkantung (marsupial) yang hidup di pohon",
                    "Memiliki ekor yang bisa menggenggam dahan (prehensil)",
                    "Bergerak lambat dan aktif di malam hari",
                    "Ditemukan di Indonesia Timur dan Australia",
                    "Matanya bulat dengan pupil vertikal seperti kucing"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "LUWAK",
                "hints": [
                    "Terkenal karena membantu menghasilkan kopi termahal",
                    "Memilih biji kopi terbaik untuk dimakan",
                    "Hewan nokturnal sejenis musang",
                    "Memiliki penciuman tajam untuk memilih buah matang",
                    "Sering dianggap hama oleh petani buah"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ALPAKA",
                "hints": [
                    "Sering meludah jika merasa kesal atau terancam",
                    "Berasal dari pegunungan Andes di Amerika Selatan",
                    "Diternakkan untuk diambil bulunya yang sangat halus",
                    "Berkerabat dengan unta tapi lebih kecil dan tanpa punuk",
                    "Hewan yang sangat sosial dan hidup dalam kawanan"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "HYENA",
                "hints": [
                    "Suaranya mirip seperti orang tertawa histeris",
                    "Memiliki rahang yang sangat kuat untuk menghancurkan tulang",
                    "Hidup dalam klan yang dipimpin oleh betina",
                    "Sering dianggap pemakan bangkai, padahal pemburu hebat",
                    "Kaki depannya lebih panjang dari kaki belakang"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BUNGLON",
                "hints": [
                    "Matanya bisa bergerak independen ke dua arah berbeda",
                    "Lidahnya bisa melesat lebih panjang dari tubuhnya",
                    "Terkenal karena kemampuan mengubah warna kulit",
                    "Perubahan warnanya sebenarnya untuk komunikasi mood, bukan cuma kamuflase",
                    "Jari kakinya menyatu seperti penjepit"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BELANGKAS",
                "hints": [
                    "Darahnya berwarna biru dan sangat mahal untuk medis",
                    "Disebut 'fosil hidup' karena tak berubah jutaan tahun",
                    "Hewan laut ber-cangkang keras seperti helm tentara",
                    "Sering ditemukan berpasangan di pantai",
                    "Sebenarnya lebih dekat kekerabatannya dengan laba-laba daripada kepiting"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PESUT",
                "hints": [
                    "Mamalia air tawar yang hidup di Sungai Mahakam",
                    "Sering disalahartikan sebagai lumba-lumba air tawar",
                    "Memiliki dahi yang bulat dan menonjol",
                    "Populasinya sangat terancam punah",
                    "Mengandalkan sonar karena air sungai yang keruh"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            }
        ],
        "buah": [
            {
                "word": "APEL",
                "hints": [
                    "Identik dengan warna merah atau hijau",
                    "Buah yang konon menjauhkan kita dari dokter",
                    "Dikaitkan dengan tokoh Isaac Newton dan gravitasi",
                    "Buah beracun di dongeng Putri Salju",
                    "Kota Malang terkenal dengan buah ini"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "JERUK",
                "hints": [
                    "Sumber vitamin C paling populer",
                    "Identik dengan warna oranye",
                    "Wajib ada saat perayaan Imlek",
                    "Memiliki kulit berpori yang mengandung minyak atsiri",
                    "Rasanya ada yang manis dan ada yang sangat asam"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PISANG",
                "hints": [
                    "Kulitnya licin dan sering jadi bahan komedi terpeleset",
                    "Tumbuh dalam tandan dan sisir",
                    "Sangat kaya akan kalium",
                    "Buah favorit monyet di kartun",
                    "Pohonnya hanya berbuah sekali seumur hidup"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "MANGGA",
                "hints": [
                    "Harum Manis dan Manalagi adalah jenis populernya",
                    "Buah musiman yang sangat ditunggu di Indonesia",
                    "Enak dimakan muda untuk rujak",
                    "Daging buah berwarna oranye kekuningan saat matang",
                    "Memiliki satu biji pelok yang besar dan pipih"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "NANAS",
                "hints": [
                    "Memiliki 'mata' yang banyak di kulitnya",
                    "Memiliki mahkota daun berduri di atasnya",
                    "Rumah tokoh kartun Spongebob",
                    "Mengandung enzim bromelain yang bisa mengempukkan daging",
                    "Bisa membuat lidah terasa gatal jika makan terlalu banyak"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SEMANGKA",
                "hints": [
                    "Buah besar dengan kadar air sangat tinggi",
                    "Kulitnya keras berwarna hijau loreng",
                    "Dagingnya biasanya merah atau kuning",
                    "Bijinya bisa dikeringkan menjadi kuaci",
                    "Tumbuh merambat di tanah"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ANGGUR",
                "hints": [
                    "Buah kecil bulat yang tumbuh bergerombol",
                    "Bisa dikeringkan menjadi kismis",
                    "Bahan baku utama minuman wine",
                    "Tanaman merambat yang butuh penopang",
                    "Ada varietas yang tanpa biji"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "DURIAN",
                "hints": [
                    "Dijuluki sebagai raja segala buah (King of Fruits)",
                    "Memiliki aroma yang sangat menyengat",
                    "Kulitnya penuh duri tajam",
                    "Sering dilarang masuk ke hotel atau pesawat",
                    "Daging buahnya lembek dan creamy"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KELAPA",
                "hints": [
                    "Airnya adalah minuman isotonik alami",
                    "Dagingnya yang tua diperas menjadi santan",
                    "Tumbuh subur di pinggir pantai",
                    "Memiliki batok yang keras",
                    "Tunasnya menjadi lambang Pramuka"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PEPAYA",
                "hints": [
                    "Dikenal bagus untuk melancarkan pencernaan",
                    "Memiliki banyak biji bulat kecil berwarna hitam",
                    "Daging buah berwarna oranye kemerahan dan empuk",
                    "Daunnya pahit tapi bisa dimakan sebagai lalap",
                    "Sering disebut kates di beberapa daerah"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "STROBERI",
                "hints": [
                    "Satu-satunya buah yang bijinya ada di luar kulit",
                    "Berwarna merah cerah dengan bintik-bintik",
                    "Rasanya asam manis segar",
                    "Identik dengan bentuk hati",
                    "Tumbuh baik di daerah berhawa dingin"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "RAMBUTAN",
                "hints": [
                    "Namanya diambil dari ciri fisik kulitnya",
                    "Daging buah putih bening mirip kelengkeng",
                    "Sering diserbu semut hitam di pohonnya",
                    "Bahasa Inggrisnya 'hairy fruit'",
                    "Jenis 'Rapiah' dikenal paling enak dan 'ngelotok'"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SALAK",
                "hints": [
                    "Kulitnya bersisik seperti kulit ular",
                    "Bahasa Inggrisnya 'snake fruit'",
                    "Bijinya keras berwarna coklat tua",
                    "Jenis Pondoh sangat populer dari Jogja",
                    "Rasanya sepat jika masih muda"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "MANGGIS",
                "hints": [
                    "Dijuluki ratu segala buah (Queen of Fruits)",
                    "Kulitnya tebal berwarna ungu gelap",
                    "Dagingnya putih bersih beruas-ruas",
                    "Jumlah isi bisa ditebak dari kelopak di pantat buah",
                    "Kulitnya sering dijadikan ekstrak obat herbal"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ALPUKAT",
                "hints": [
                    "Buah dengan kandungan lemak nabati sehat tertinggi",
                    "Sering dijuluki 'mentega buah'",
                    "Enak dimakan sebagai teman roti panggang",
                    "Jusnya populer dicampur susu kental manis coklat",
                    "Memiliki satu biji bulat yang besar"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "NANGKA",
                "hints": [
                    "Buah yang menghasilkan getah sangat lengket",
                    "Saat muda digunakan untuk sayur gudeg",
                    "Memiliki aroma wangi yang khas dan kuat",
                    "Buah terbesar yang tumbuh di pohon",
                    "Bijinya disebut 'beton' dan bisa direbus"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "JAMBU",
                "hints": [
                    "Jenis yang merah dipercaya menaikkan trombosit (DBD)",
                    "Memiliki sangat banyak biji kecil yang keras seperti batu",
                    "Ada jenis yang berisi banyak air (water apple)",
                    "Daunnya sering jadi obat diare alami",
                    "Sering dibuat jus atau rujak"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "MELON",
                "hints": [
                    "Kerabat dekat semangka dan timun",
                    "Kulitnya tebal dan memiliki pola jaring-jaring kasar",
                    "Dagingnya ada yang hijau muda atau oranye",
                    "Sering dijadikan perasa sirup berwarna hijau",
                    "Tumbuh merambat di tanah"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BELIMBING",
                "hints": [
                    "Jika dipotong melintang berbentuk bintang",
                    "Bahasa Inggrisnya 'star fruit'",
                    "Memiliki lima rusuk yang jelas",
                    "Rasanya sangat menyegarkan, asam manis berair",
                    "Identik dengan kota Demak"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "DUKU",
                "hints": [
                    "Buah kecil bulat bergerombol berwarna kuning pucat",
                    "Mirip lengkeng tapi kulitnya lunak dan bergetah jika digigit",
                    "Daerah Palembang terkenal dengan buah ini",
                    "Bijinya pahit jika tergigit",
                    "Daging buahnya bening dan berair"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "NAGA",
                "hints": [
                    "Kulitnya memiliki sisik seperti hewan mitologi",
                    "Sebenarnya adalah buah dari jenis kaktus",
                    "Dagingnya ada yang putih, merah, atau kuning",
                    "Memiliki ribuan biji hitam kecil yang bisa dimakan",
                    "Sering jadi hiasan saat perayaan Imlek"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KIWI",
                "hints": [
                    "Kulitnya coklat tipis dan berbulu halus",
                    "Dagingnya hijau cerah (atau emas) dengan cincin biji hitam",
                    "Buah ikonik dari Selandia Baru",
                    "Awalnya bernama 'Chinese Gooseberry'",
                    "Sangat tinggi vitamin C, lebih dari jeruk"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "DELIMA",
                "hints": [
                    "Berisi ratusan butir biji merah yang bisa dimakan",
                    "Sering dijadikan lambang kesuburan di berbagai budaya",
                    "Butuh usaha ekstra untuk memakannya karena banyak sekat",
                    "Bahasa Inggrisnya 'Pomegranate'",
                    "Kaya antioksidan dan berwarna merah ruby"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SIRSAK",
                "hints": [
                    "Kulitnya hijau dengan duri-duri lunak yang tidak tajam",
                    "Dagingnya putih, berserat, dan rasanya asam manis",
                    "Bahasa Inggrisnya 'Soursop'",
                    "Sering diolah menjadi jus kental berwarna putih",
                    "Daunnya populer sebagai obat herbal anti kanker"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "MARKISA",
                "hints": [
                    "Bijinya diselimuti selaput lendir oranye yang asam segar",
                    "Sering dijadikan sirup khas dari Makassar",
                    "Kulitnya akan keriput saat sudah matang benar",
                    "Tanaman merambat dengan bunga yang cantik",
                    "Cara makannya seringkali langsung disedot dari kulitnya"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KLENGKENG",
                "hints": [
                    "Sering disebut 'mata naga' karena bentuk biji dan dagingnya",
                    "Kulitnya tipis, keras, dan berwarna coklat muda",
                    "Dagingnya transparan dan sangat manis",
                    "Sering dijual masih dengan tangkai-tangkainya",
                    "Mirip leci tapi lebih kecil dan tidak bertekstur kasar"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "LECI",
                "hints": [
                    "Kulitnya merah cerah dengan tekstur kasar bergerindil",
                    "Daging buah putih wangi dan sangat berair",
                    "Sering ditemukan dalam bentuk kalengan atau sirup",
                    "Buah favorit Kekaisaran Tiongkok kuno",
                    "Rasanya manis harum yang khas"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KEDONDONG",
                "hints": [
                    "Bijinya memiliki serat-serat kasar seperti duri",
                    "Buah wajib dalam rujak, rasanya masam renyah",
                    "Kulitnya hijau keras meskipun sudah matang",
                    "Sering dijadikan manisan basah",
                    "Daging buahnya berwarna putih kehijauan"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BENGKOANG",
                "hints": [
                    "Sebenarnya adalah umbi akar, tapi sering dimakan sebagai buah",
                    "Dagingnya putih bersih, renyah, dan banyak air",
                    "Sering dipakai untuk bahan masker pemutih wajah",
                    "Rasanya tawar sedikit manis",
                    "Bahan utama rujak dan asinan Bogor"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SAWO",
                "hints": [
                    "Kulitnya coklat tipis mirip warna kulit manusia Indonesia",
                    "Dagingnya coklat, manis, dan agak berpasir teksturnya",
                    "Jika belum matang sempurna getahnya sangat lengket",
                    "Bijinya berwarna hitam legam mengkilap lonjong",
                    "Ada jenis populernya yang bernama Manila"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KURMA",
                "hints": [
                    "Buah dari pohon palem yang tumbuh di gurun",
                    "Makanan utama saat berbuka puasa",
                    "Sangat manis dan awet disimpan lama tanpa pengawet",
                    "Oleh-oleh paling umum dari ibadah Haji",
                    "Disebut berkali-kali dalam kitab suci"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ZAITUN",
                "hints": [
                    "Lebih terkenal sebagai minyak daripada buah utuh",
                    "Sering dijadikan topping pizza (berwarna hitam atau hijau)",
                    "Pohonnya bisa hidup ratusan hingga ribuan tahun",
                    "Rantingnya adalah simbol perdamaian dunia",
                    "Rasanya asin gurih jika sudah dijadikan asinan"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "CERI",
                "hints": [
                    "Buah kecil merah yang sering jadi hiasan puncak kue tart",
                    "Memiliki tangkai panjang yang sering diikat dengan lidah",
                    "Bunga dari pohonnya adalah Sakura (untuk beberapa jenis)",
                    "Sangat mahal jika dibeli dalam keadaan segar di Indonesia",
                    "Sering jadi istilah untuk sesuatu yang 'manis' di akhir (cherry on top)"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PIR",
                "hints": [
                    "Bentuknya unik, membesar di bagian bawah seperti lonceng",
                    "Dagingnya mirip apel tapi lebih berpasir dan berair",
                    "Jenis 'Xiang Lie' populer saat Imlek",
                    "Sering dibungkus jaring busa putih saat dijual",
                    "Kulitnya biasanya kuning pucat atau hijau kecoklatan"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BLEWAH",
                "hints": [
                    "Sangat populer sebagai minuman es saat bulan puasa",
                    "Mirip melon tapi kulitnya tipis berwarna oranye bercorak",
                    "Dagingnya diserut memanjang untuk es",
                    "Memiliki aroma harum yang sangat khas saat matang",
                    "Masih satu keluarga dengan labu"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SRIKAYA",
                "hints": [
                    "Kulitnya hijau berbenjol-benjol seperti sisik besar",
                    "Dagingnya putih, manis berpasir, dan mudah hancur",
                    "Bahasa Inggrisnya 'Sugar Apple'",
                    "Bijinya banyak berwarna hitam mengkilap",
                    "Masih berkerabat dekat dengan sirsak"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "TIMUN SURI",
                "hints": [
                    "Buah musiman yang 'mendadak' muncul saat Ramadhan",
                    "Bentuknya lonjong besar, kulit kuning retak-retak saat matang",
                    "Dagingnya sangat rapuh, berpasir dan berair",
                    "Sebenarnya lebih dekat kekerabatannya dengan melon daripada timun",
                    "Penyegar dahaga yang populer untuk buka puasa"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PERSIK",
                "hints": [
                    "Kulitnya berbulu sangat halus seperti beludru",
                    "Dagingnya kuning oranye dengan satu biji besar yang keras",
                    "Bahasa Inggrisnya 'Peach'",
                    "Dalam legenda Tiongkok, ini adalah buah keabadian",
                    "Sering diasosiasikan dengan warna merah muda kekuningan"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BLUEBERRY",
                "hints": [
                    "Buah beri kecil bulat berwarna biru tua keunguan",
                    "Sering dianggap sebagai 'superfood' kaya antioksidan",
                    "Populer sebagai isian muffin atau pancake",
                    "Jarang tumbuh di iklim tropis panas",
                    "Daging buahnya berwarna kehijauan atau ungu muda"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "JAMBU METE",
                "hints": [
                    "Yang sering dimakan sebenarnya adalah tangkai buah yang menggembung",
                    "Bijinya yang sejati menggantung di luar buah (kacang)",
                    "Buah semunya terasa sepat dan manis, sering dibuang",
                    "Namanya mengandung kata hewan primata",
                    "Kacangnya jauh lebih mahal daripada buahnya"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "MATOA",
                "hints": [
                    "Buah khas dari tanah Papua",
                    "Rasanya unik, campuran durian, kelengkeng, dan rambutan",
                    "Kulitnya keras, bisa berwarna hijau, merah, atau hitam",
                    "Pohonnya besar dan tinggi (kayu keras)",
                    "Harganya cukup mahal di luar daerah asalnya"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KEPEL",
                "hints": [
                    "Buah favorit putri-putri keraton Yogyakarta zaman dulu",
                    "Konon bisa membuat keringat menjadi wangi dan membuat air seni tidak berbau tajam",
                    "Buahnya tumbuh menempel langsung di batang pohon utama",
                    "Bentuknya bulat, kulit coklat, dagingnya jingga",
                    "Sekarang sudah menjadi tanaman langka"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "GANDARIA",
                "hints": [
                    "Flora identitas provinsi Jawa Barat",
                    "Saat muda berwarna hijau dan sangat asam (untuk sambal)",
                    "Saat matang berwarna oranye dan rasanya manis asam",
                    "Bijinya berwarna ungu terang yang unik",
                    "Sering disebut juga 'Jatake'"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "DUWET",
                "hints": [
                    "Sering disebut 'anggur jawa' atau 'jamblang'",
                    "Bentuknya mirip anggur tapi pohonnya besar berkayu",
                    "Rasanya sepat, masam, dan sedikit manis",
                    "Meninggalkan warna ungu pekat di lidah setelah dimakan",
                    "Kulitnya ungu kehitaman mengkilap"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KERSEN",
                "hints": [
                    "Pohon peneduh yang tumbuh liar di pinggir jalan",
                    "Buahnya kecil-kecil bulat berwarna merah cerah dan manis",
                    "Sering dianggap gulma padahal buahnya bermanfaat",
                    "Disukai burung dan anak-anak kecil",
                    "Nama lainnya adalah talok atau ceri jawa"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "MENGKUDU",
                "hints": [
                    "Memiliki bau yang sangat busuk dan menyengat saat matang",
                    "Sering digunakan sebagai obat herbal penurun darah tinggi",
                    "Buahnya berbenjol-benjol tidak beraturan",
                    "Dikenal sebagai 'Cheese Fruit' di barat karena baunya mirip keju busuk",
                    "Nama lainnya adalah Pace"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SUKUN",
                "hints": [
                    "Bahasa Inggrisnya 'Breadfruit' (buah roti)",
                    "Buah ini tinggi karbohidrat dan mengenyangkan",
                    "Biasanya digoreng atau dikukus seperti ubi",
                    "Buah yang umumnya tidak memiliki biji",
                    "Daunnya lebar menjari dan sangat khas"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "CEMPEDAK",
                "hints": [
                    "Mirip nangka tapi bentuknya lebih lonjong dan ramping",
                    "Aromanya jauh lebih menyengat daripada nangka",
                    "Kulitnya bisa digoreng dan dimakan",
                    "Daging buahnya lebih lembek dan 'nyemek'",
                    "Buah asli Indonesia yang mulai jarang ditemukan di kota"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KESEMEK",
                "hints": [
                    "Dijuluki 'buah bedak' karena kulitnya tertutup serbuk putih",
                    "Serbuk putih itu sebenarnya adalah kapur untuk menghilangkan rasa sepat",
                    "Aslinya berasal dari Tiongkok dan Jepang (Persimmon)",
                    "Dagingnya berwarna oranye kemerahan",
                    "Jika matang di pohon tanpa diperam rasanya sangat sepat"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KECAPI",
                "hints": [
                    "Kulitnya sangat keras, sering dijepit di engsel pintu untuk membukanya",
                    "Daging dalam berwarna putih kapas, rasanya asam manis",
                    "Pohonnya besar dan rimbun, dulu banyak di pekarangan Betawi",
                    "Nama lainnya adalah buah Sentul",
                    "Bisa dibuat manisan dari kulit bagian dalamnya"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ARA",
                "hints": [
                    "Dikenal juga dengan nama buah Tin",
                    "Salah satu buah yang disebut di kitab suci",
                    "Bunganya sebenarnya tersembunyi di dalam buahnya",
                    "Memiliki tekstur unik dengan banyak biji kecil renyah",
                    "Getahnya bisa menyebabkan iritasi kulit"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BIT",
                "hints": [
                    "Sebenarnya umbi akar, tapi sering dijus bersama buah-buahan",
                    "Warnanya merah darah pekat alami",
                    "Memiliki rasa 'tanah' (earthy) yang khas",
                    "Sering dipakai sebagai pewarna makanan alami merah",
                    "Bagus untuk menambah darah"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "CERMAI",
                "hints": [
                    "Buah kecil bulat berwarna kuning pucat bergerigi",
                    "Rasanya sangat asam",
                    "Buahnya tumbuh menempel langsung di ranting-ranting",
                    "Sering dijadikan manisan untuk mengurangi rasa asamnya",
                    "Daun mudanya bisa dimasak sebagai sayur"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BUNI",
                "hints": [
                    "Buah beri kecil yang tumbuh dalam tandan mirip anggur mini",
                    "Dalam satu tandan warnanya bisa warna-warni (hijau, merah, ungu)",
                    "Sering dipakai untuk campuran rujak ulek (bebeg)",
                    "Rasanya campuran asam, sepat, dan manis",
                    "Makan banyak buah ini bisa membuat lidah berwarna ungu"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "NAMNAM",
                "hints": [
                    "Bentuknya unik seperti ginjal atau kerang setengah lingkaran",
                    "Kulitnya coklat kehijauan dan berkerut-kerut",
                    "Tumbuh di batang bagian bawah dekat tanah",
                    "Rasanya sangat asam segar, cocok untuk rujak",
                    "Buah langka yang dulu banyak ditanam di istana"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KAWISTA",
                "hints": [
                    "Kulitnya keras seperti kayu, harus dibanting ke lantai untuk membukanya",
                    "Daging buahnya berwarna coklat hitam dan beraroma sangat wangi",
                    "Sering diolah menjadi sirup yang dijuluki 'Cola van Java'",
                    "Khas dari daerah Rembang",
                    "Masih berkerabat dengan jeruk (Rutaceae)"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "GOWOK",
                "hints": [
                    "Sering juga disebut buah Kupa",
                    "Buah kecil berwarna ungu gelap yang menempel di dahan",
                    "Daging buah putih, rasanya asam sepat",
                    "Sering dijual dalam bentuk untaian di pasar tradisional",
                    "Kulitnya agak tebal untuk ukuran buah kecil"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "LOBI-LOBI",
                "hints": [
                    "Buah bulat kecil berwarna merah tua saat matang",
                    "Rasanya sangat masam, biasanya harus dipijit dulu sebelum dimakan",
                    "Pohonnya memiliki banyak duri tajam",
                    "Sering dijadikan bahan rujak atau manisan",
                    "Namanya terdengar lucu karena pengulangan kata"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ZURIAT",
                "hints": [
                    "Berasal dari Timur Tengah, populer sebagai oleh-oleh haji",
                    "Dijuluki 'buah keturunan' karena dipercaya untuk program hamil",
                    "Sangat keras seperti batu, hampir mustahil digigit langsung",
                    "Biasanya direbus airnya untuk diminum",
                    "Tumbuh dari sejenis pohon palem (doum palm)"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "RUKEM",
                "hints": [
                    "Buah tradisional yang harus dipijit-pijit dulu agar tidak sepat",
                    "Berwarna merah keunguan saat matang",
                    "Pohonnya berduri di batangnya",
                    "Rasanya asam manis jika sudah matang benar",
                    "Mulai jarang ditemukan, biasanya tumbuh liar"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            }
        ],
        "bunga": [
            {
                "word": "MAWAR",
                "hints": [
                    "Identik dengan duri di tangkainya",
                    "Simbol universal kasih sayang dan romansa",
                    "Sering diberikan saat hari Valentine",
                    "Bisa diekstrak menjadi air untuk kecantikan",
                    "Warnanya yang merah bermakna berani/cinta"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "MELATI",
                "hints": [
                    "Bunga kecil berwarna putih dengan wangi khas",
                    "Salah satu bunga nasional (Puspa Bangsa) Indonesia",
                    "Sering dironce untuk hiasan pengantin adat",
                    "Campuran populer untuk minuman teh",
                    "Tumbuh merambat di pagar"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "MATAHARI",
                "hints": [
                    "Selalu memutar wajahnya mengikuti arah surya",
                    "Bunganya sangat besar berwarna kuning terang",
                    "Bijinya diolah menjadi camilan kuaci",
                    "Menghasilkan minyak nabati dari bijinya",
                    "Batangnya bisa tumbuh sangat tinggi melebihi manusia"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ANGGREK",
                "hints": [
                    "Tumbuh menumpang pada pohon lain (epifit)",
                    "Jenis 'Bulan' adalah Puspa Pesona Indonesia",
                    "Bunganya tahan lama tidak mudah layu",
                    "Memiliki ribuan spesies dengan bentuk unik",
                    "Akarnya sering menjuntai di udara"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "TULIP",
                "hints": [
                    "Bunga ikon negara Belanda",
                    "Tumbuh dari umbi lapis",
                    "Bentuk kuncupnya sangat khas seperti cangkir lonjong",
                    "Taman Keukenhof terkenal karena bunga ini",
                    "Pernah menyebabkan krisis ekonomi kuno (Tulip Mania)"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "TERATAI",
                "hints": [
                    "Hidup mengapung di permukaan air tenang",
                    "Daunnya lebar dan anti air",
                    "Akarnya tertanam di lumpur dasar kolam",
                    "Sering menjadi tempat katak hinggap di kartun",
                    "Mekar di pagi hari dan kuncup di sore hari"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SAKURA",
                "hints": [
                    "Ikon negara Jepang",
                    "Hanya mekar sebentar di musim semi",
                    "Mekar serentak berwarna merah muda pucat",
                    "Tradisi melihatnya disebut Hanami",
                    "Sering diasosiasikan dengan samurai (hidup singkat tapi indah)"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KAMBOJA",
                "hints": [
                    "Sering diasosiasikan dengan pemakaman di Jawa",
                    "Sangat populer sebagai hiasan telinga di Bali",
                    "Batangnya lunak dan bergetah putih susu",
                    "Mahkotanya tebal, wangi, dan sering jatuh utuh",
                    "Warna populernya putih dengan pusat kuning"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SEPATU",
                "hints": [
                    "Memiliki putik yang menjulur panjang keluar",
                    "Tanaman pagar yang umum di Indonesia",
                    "Bunga raya adalah sebutannya di Malaysia",
                    "Bisa digunakan untuk menyemir alas kaki (asal namanya)",
                    "Kelopaknya lebar berbentuk terompet"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "LAVENDER",
                "hints": [
                    "Berwarna ungu kebiruan",
                    "Wanginya efektif mengusir nyamuk",
                    "Sering digunakan untuk aromaterapi relaksasi tidur",
                    "Ladangnya sangat terkenal di Provence, Perancis",
                    "Tumbuh bergerombol seperti semak rumput"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "DAHLIA",
                "hints": [
                    "Berasal dari Meksiko",
                    "Memiliki umbi di dalam tanah",
                    "Kelopaknya sangat banyak dan bertumpuk rapi",
                    "Populer sebagai tanaman hias di daerah sejuk",
                    "Namanya mirip nama perempuan"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BAKUNG",
                "hints": [
                    "Sering disebut bunga Lily",
                    "Bentuknya seperti terompet besar",
                    "Memiliki serbuk sari yang bisa menodai baju",
                    "Sangat beracun bagi hewan kucing",
                    "Wanginya sangat semerbak di ruangan"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KENANGA",
                "hints": [
                    "Berwarna hijau kekuningan saat mekar",
                    "Wanginya sangat kuat dan khas",
                    "Sering dikaitkan dengan hal-hal mistis di Jawa",
                    "Bahan dasar parfum tradisional",
                    "Pohonnya bisa tumbuh sangat tinggi"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "EDELWEIS",
                "hints": [
                    "Dijuluki bunga abadi karena tidak mudah layu",
                    "Tumbuh di dataran tinggi atau gunung",
                    "Dilarang keras untuk dipetik oleh pendaki",
                    "Bunganya kecil-kecil berbulu halus putih",
                    "Simbol perjuangan mencapai puncak"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KRISAN",
                "hints": [
                    "Sering dipakai untuk karangan bunga duka cita di barat",
                    "Di Asia melambangkan kegembiraan dan panjang umur",
                    "Tehnya populer untuk meredakan panas dalam",
                    "Nama lainnya adalah Seruni",
                    "Sangat awet sebagai bunga potong"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ASOKA",
                "hints": [
                    "Terdiri dari bunga-bunga kecil merah bergerombol",
                    "Anak-anak suka menghisap nektar manis di pangkalnya",
                    "Berasal dari India, namanya berarti 'tanpa duka'",
                    "Pohonnya sering dijadikan peneduh jalan",
                    "Bentuk gerombolnya setengah bola"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ANYELIR",
                "hints": [
                    "Dikenal juga sebagai Carnation",
                    "Sering dipakai sebagai hiasan di saku jas (boutonniere)",
                    "Identik dengan perayaan Hari Ibu atau Hari Guru",
                    "Pinggiran kelopaknya bergerigi",
                    "Tahan lama setelah dipotong"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BUGENVIL",
                "hints": [
                    "Sering disebut bunga kertas karena teksturnya tipis",
                    "Yang berwarna-warni sebenarnya adalah daun pelindung (bract)",
                    "Bunga aslinya kecil berwarna putih di tengah",
                    "Tanamannya berduri dan tahan panas matahari",
                    "Populer dijadikan tanaman bonsai"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "FLAMBOYAN",
                "hints": [
                    "Pohon besar yang bunganya merah menyala",
                    "Mekar serentak saat musim panas/kemarau",
                    "Menciptakan pemandangan seperti pohon yang terbakar",
                    "Berasal dari Madagaskar",
                    "Daunnya kecil-kecil mirip daun petai cina"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SEDAP MALAM",
                "hints": [
                    "Hanya mengeluarkan wangi kuat di malam hari",
                    "Bunganya putih tersusun pada tangkai panjang",
                    "Wajib ada saat perayaan Imlek atau Lebaran",
                    "Berasal dari umbi",
                    "Sering dipakai dalam industri parfum"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "RAFFLESIA",
                "hints": [
                    "Bunga tunggal terbesar di dunia",
                    "Merupakan parasit, tidak punya daun atau batang sendiri",
                    "Ikon provinsi Bengkulu",
                    "Mengeluarkan bau busuk untuk menarik lalat",
                    "Memiliki 5 kelopak besar yang tebal berbintik"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "AMARILIS",
                "hints": [
                    "Sempat viral di Yogyakarta karena kebunnya diinjak-injak",
                    "Bentuk terompet besar, sering berwarna oranye/merah",
                    "Hanya mekar setahun sekali di awal musim hujan",
                    "Tumbuh dari umbi yang besar",
                    "Dikenal juga sebagai 'Bunga Desember' di beberapa tempat"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ASTER",
                "hints": [
                    "Bentuknya mirip bunga matahari versi mini dan berwarna-warni",
                    "Berasal dari bahasa Yunani yang berarti 'Bintang'",
                    "Sering digunakan sebagai bunga potong pengisi buket",
                    "Tumbuh merumpun dengan banyak cabang",
                    "Sangat disukai lebah dan kupu-kupu"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "LOTUS",
                "hints": [
                    "Sering disalahartikan sebagai teratai",
                    "Daun dan bunganya menjulang naik di atas permukaan air",
                    "Bunga suci dalam agama Buddha dan Hindu",
                    "Bijinya ada di dalam bonggol dan bisa dimakan",
                    "Batangnya berongga bisa dijadikan sayur"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KECUBUNG",
                "hints": [
                    "Bentuknya seperti terompet yang menggantung ke bawah",
                    "Termasuk tanaman yang sangat beracun (narkotika alami)",
                    "Bisa menyebabkan halusinasi parah",
                    "Buahnya bulat dan berduri-duri tumpul",
                    "Sering disalahgunakan sebagai zat pembius"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "HYDRANGEA",
                "hints": [
                    "Dikenal juga dengan nama Pancawarna atau Kembang Bokor",
                    "Warna bunga bisa berubah tergantung pH (keasaman) tanah",
                    "Bunganya berbentuk bola besar yang terdiri dari bunga kecil-kecil",
                    "Tumbuh subur di daerah berhawa sejuk",
                    "Jika tanah asam jadi biru, jika basa jadi pink"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "WIJAYA KUSUMA",
                "hints": [
                    "Hanya mekar sempurna beberapa jam di tengah malam",
                    "Layu total sebelum matahari terbit",
                    "Sebenarnya adalah jenis kaktus hutan",
                    "Mitosnya membawa keberuntungan bagi yang melihatnya mekar",
                    "Bunganya besar, putih, dan sangat wangi"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ALAMANDA",
                "hints": [
                    "Bunga terompet berwarna kuning cerah",
                    "Tumbuh merambat dan sering dijadikan penutup pagar",
                    "Memiliki getah yang bisa mengiritasi kulit",
                    "Sering disebut sebagai lonceng emas",
                    "Berasal dari Amerika Tengah dan Selatan"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PACAR AIR",
                "hints": [
                    "Buahnya akan meletus dan melontarkan biji jika disentuh",
                    "Batangnya basah dan bening berair",
                    "Bunganya berwarna cerah (pink, ungu, putih)",
                    "Dulu sering dipakai anak-anak untuk mewarnai kuku",
                    "Mudah tumbuh liar di tempat lembab"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "GARDENIA",
                "hints": [
                    "Lebih dikenal dengan nama Kaca Piring di Indonesia",
                    "Bunganya putih, teksturnya 'creamy' dan sangat wangi",
                    "Daunnya berwarna hijau gelap dan mengkilap",
                    "Mudah berubah kecoklatan jika disentuh kelopaknya",
                    "Berasal dari Asia Timur"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "MAGNOLIA",
                "hints": [
                    "Salah satu tanaman bunga paling purba di bumi",
                    "Sering dianggap sama dengan Cempaka",
                    "Bunganya besar, kokoh, dan wangi",
                    "Tumbuh di pohon yang berkayu keras",
                    "Di Jawa sering disebut kembang kempit"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "GERANIUM",
                "hints": [
                    "Daunnya memiliki aroma khusus yang tidak disukai nyamuk",
                    "Sering ditanam di pot gantung",
                    "Mirip dengan bunga Tapak Dara",
                    "Minyaknya sering dipakai di lotion anti nyamuk",
                    "Memiliki warna-warna cerah mencolok"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "DANDELION",
                "hints": [
                    "Sebenarnya adalah gulma atau rumput liar",
                    "Saat matang, bunganya berubah jadi bola kapas putih",
                    "Benihnya terbang terbawa angin",
                    "Sering disebut Randa Tapak di Indonesia",
                    "Bunga mudanya berwarna kuning cerah"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PEONY",
                "hints": [
                    "Bunga lambang kekayaan dan kehormatan di Tiongkok",
                    "Memiliki kelopak yang sangat banyak, besar dan rimbun",
                    "Sering mekar di akhir musim semi",
                    "Sangat mahal harganya sebagai bunga potong",
                    "Bisa hidup hingga puluhan tahun"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "GLADIOL",
                "hints": [
                    "Namanya berasal dari kata 'Gladius' (pedang) karena bentuk daunnya",
                    "Bunga tumbuh berderet vertikal pada satu tangkai panjang",
                    "Mekar berurutan dari bawah ke atas",
                    "Tumbuh dari umbi batang (corm)",
                    "Bunga potong klasik jaman dulu"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KANTIL",
                "hints": [
                    "Cempaka putih yang wanginya sangat tajam",
                    "Identik dengan mitos horor di Indonesia",
                    "Wajib ada dalam hiasan sanggul pengantin Jawa",
                    "Konon disukai makhluk halus",
                    "Kuncupnya seperti peluru berwarna putih gading"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ZINNIA",
                "hints": [
                    "Juga sering disebut 'bunga kertas' (selain bugenvil)",
                    "Bunga favorit untuk menarik kupu-kupu ke taman",
                    "Sangat mudah ditanam dari biji",
                    "Berasal dari semak belukar di Meksiko",
                    "Bunga pertama yang ditanam di luar angkasa (ISS)"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "MIMOSA",
                "hints": [
                    "Dikenal sebagai Putri Malu",
                    "Daunnya akan menutup rapat jika disentuh",
                    "Bunganya berbentuk bola-bola berbulu pink",
                    "Batangnya penuh duri kecil tajam",
                    "Tumbuh liar di lapangan rumput"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SAFFRON",
                "hints": [
                    "Rempah termahal di dunia berasal dari putik bunga ini",
                    "Merupakan jenis bunga Crocus",
                    "Hanya memiliki 3 helai putik merah per bunga",
                    "Harus dipanen manual dengan tangan saat subuh",
                    "Memberi warna kuning emas pada masakan"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KEMUNING",
                "hints": [
                    "Wanginya mirip melati tapi lebih tajam",
                    "Daunnya kecil-kecil, hijau tua dan mengkilap",
                    "Menghasilkan buah kecil berwarna merah",
                    "Kayunya yang berwarna kuning sering dipakai untuk keris",
                    "Sering ditanam sebagai tanaman pagar hidup"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BANGKAI",
                "hints": [
                    "Sering tertukar dengan Rafflesia, padahal berbeda",
                    "Memiliki tongkol (spadix) yang menjulang tinggi ke atas",
                    "Nama latinnya Amorphophallus titanum",
                    "Tumbuh dari umbi jenis talas-talasan (suweg)",
                    "Mekar sangat jarang dan baunya busuk"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "TELANG",
                "hints": [
                    "Berwarna biru keunguan yang pekat",
                    "Dipakai sebagai pewarna alami makanan dan minuman",
                    "Air seduhannya berubah jadi ungu jika ditetesi jeruk nipis",
                    "Tumbuh merambat dengan cepat",
                    "Bentuknya dianggap mirip alat kelamin wanita (nama latinnya)"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KECOMBRANG",
                "hints": [
                    "Bunga yang populer dijadikan bumbu masakan (sambal/pecel)",
                    "Nama lainnya adalah Honje",
                    "Berwarna merah muda, besar, dan berbatang tinggi",
                    "Memiliki rasa asam segar dan wangi yang khas",
                    "Termasuk keluarga jahe-jahean"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KADUPUL",
                "hints": [
                    "Bunga termahal di dunia karena tak ternilai (priceless)",
                    "Hanya mekar setahun sekali di tengah malam dan mati saat subuh",
                    "Berasal dari Sri Lanka",
                    "Wangi yang sangat menenangkan",
                    "Dijuluki 'Queen of the Night' (tapi beda spesies dengan wijaya kusuma)"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PROTEA",
                "hints": [
                    "Bunga nasional Afrika Selatan",
                    "Bentuknya purba, besar seperti mangkuk dengan kelopak kaku",
                    "Bisa bertahan dari kebakaran hutan",
                    "Namanya diambil dari dewa laut Yunani yang bisa berubah bentuk",
                    "Sangat awet dalam vas bunga"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "TURI",
                "hints": [
                    "Bunganya bisa dimasak menjadi pecel",
                    "Bentuk bunganya seperti kupu-kupu berwarna putih atau merah",
                    "Pohonnya termasuk jenis kacang-kacangan",
                    "Sering ditanam sebagai pembatas sawah",
                    "Daunnya juga bisa dijadikan pakan ternak"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KENIKIR",
                "hints": [
                    "Bunganya berwarna kuning atau oranye cerah",
                    "Daunnya memiliki bau khas dan populer sebagai lalapan",
                    "Sering ditanam di dekat sawah untuk mengusir hama serangga",
                    "Nama lainnya adalah Marigold kampung",
                    "Mudah tumbuh liar di pinggir jalan"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ROSELA",
                "hints": [
                    "Kelopak bunganya yang merah tua diseduh menjadi teh herbal",
                    "Rasanya sangat masam dan kaya vitamin C",
                    "Sering diolah menjadi selai atau sirup merah",
                    "Sebenarnya berkerabat dekat dengan kembang sepatu",
                    "Berasal dari benua Afrika"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ECENG GONDOK",
                "hints": [
                    "Dianggap gulma yang merusak ekosistem sungai",
                    "Memiliki bunga berwarna ungu muda yang sebenarnya cantik",
                    "Batangnya menggelembung berisi udara agar mengapung",
                    "Tumbuh sangat cepat menutupi permukaan air",
                    "Batangnya yang dikeringkan bisa jadi kerajinan anyaman"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "FOXGLOVE",
                "hints": [
                    "Bentuknya seperti lonceng-lonceng yang menggantung vertikal",
                    "Sangat cantik tapi seluruh bagiannya sangat beracun",
                    "Ekstraknya (Digitalis) digunakan dalam dosis kecil untuk obat jantung",
                    "Sering muncul dalam dongeng peri hutan Eropa",
                    "Dinamakan 'jari rubah' karena pas di kaki hewan tersebut"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SNAPDRAGON",
                "hints": [
                    "Disebut 'Bunga Mulut Naga'",
                    "Jika sisi bunganya dipencet, ia akan terbuka seperti mulut",
                    "Setelah layu, kelopak keringnya berbentuk seperti tengkorak kecil",
                    "Tumbuh memanjang vertikal dengan banyak warna",
                    "Disukai anak-anak karena bisa dimainkan"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "UDUMBARA",
                "hints": [
                    "Bunga legendaris dalam kepercayaan Buddha",
                    "Konon hanya mekar setiap 3000 tahun sekali",
                    "Sangat kecil, putih, dan bertangkai halus seperti benang",
                    "Bisa tumbuh di media aneh seperti kaca, logam, atau patung",
                    "Secara ilmiah sering dianggap sebagai telur serangga lacewing"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PUSPA",
                "hints": [
                    "Pohon kayu asli hutan pegunungan Indonesia",
                    "Bunganya putih dengan benang sari kuning, mirip telur ceplok",
                    "Nama latinnya Schima wallichii",
                    "Kayunya sering dipakai untuk membangun rumah",
                    "Kelopaknya sering berjatuhan di jalur pendakian gunung"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BROMELIA",
                "hints": [
                    "Masih satu keluarga dengan tanaman nanas",
                    "Yang terlihat seperti bunga warna-warni sebenarnya adalah daun",
                    "Menampung air di tengah kuncupnya (tangki air alami)",
                    "Sering menjadi rumah bagi katak kecil di hutan",
                    "Tanaman hias tropis yang populer"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "NEPENTHES",
                "hints": [
                    "Nama lain dari Kantong Semar",
                    "Bunganya berbentuk seperti piala atau kantong",
                    "Merupakan tanaman karnivora pemakan serangga",
                    "Memiliki cairan enzim pencerna di dalam kantongnya",
                    "Tutup kantongnya bukan untuk menangkap, tapi mencegah air hujan masuk"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "JENGGER AYAM",
                "hints": [
                    "Bentuk bunganya meliuk-liuk mirip jengger unggas",
                    "Teksturnya seperti kain beludru",
                    "Nama latinnya Celosia",
                    "Menghasilkan ribuan biji hitam yang sangat kecil",
                    "Warna umumnya merah tua atau ungu magenta"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "OSMANTHUS",
                "hints": [
                    "Bunga kecil kuning emas yang wanginya sangat manis (seperti aprikot)",
                    "Sering dikeringkan untuk campuran teh mewah di Tiongkok",
                    "Populer digunakan dalam kue-kue musim gugur Asia Timur",
                    "Wangi bunganya bisa tercium dari jarak jauh",
                    "Namanya berarti 'Bunga Wangi'"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "POPPY",
                "hints": [
                    "Simbol untuk mengenang pahlawan perang yang gugur (Remembrance Day)",
                    "Salah satu jenisnya menghasilkan getah opium",
                    "Kelopaknya sangat tipis seperti kertas tisu",
                    "Bijinya sering dipakai sebagai topping roti bagel",
                    "Bunga liar yang sering tumbuh di ladang gandum"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ANEMONE",
                "hints": [
                    "Namanya berasal dari bahasa Yunani 'angin' (Windflower)",
                    "Dalam mitologi lahir dari air mata Aphrodite",
                    "Bisa menutup kelopaknya saat hujan akan turun",
                    "Sering ditemukan di hutan daerah beriklim sedang",
                    "Namanya sama dengan hewan laut tempat tinggal ikan badut"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            }
        ],
        "kota": [
            {
                "word": "JAKARTA",
                "hints": [
                    "Ibu kota negara Indonesia saat ini",
                    "Memiliki ikon monumen dengan emas di puncaknya",
                    "Dulu dikenal dengan nama Batavia",
                    "Kota terpadat di Indonesia",
                    "Terkenal dengan moda transportasi TransJakarta dan MRT"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SURABAYA",
                "hints": [
                    "Dijuluki sebagai Kota Pahlawan",
                    "Ikonnya adalah patung ikan hiu dan buaya",
                    "Ibu kota provinsi Jawa Timur",
                    "Memiliki jembatan yang terhubung ke pulau Madura",
                    "Terkenal dengan kuliner rawon yang berwarna hitam"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BANDUNG",
                "hints": [
                    "Dijuluki Kota Kembang dan Paris van Java",
                    "Ibu kota provinsi Jawa Barat",
                    "Terkenal dengan Gedung Sate",
                    "Pusat mode/fashion dan distro di Indonesia",
                    "Dikelilingi oleh pegunungan sehingga berhawa sejuk"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "YOGYAKARTA",
                "hints": [
                    "Dipimpin oleh seorang Sultan",
                    "Dijuluki sebagai Kota Pelajar",
                    "Terkenal dengan jalan Malioboro",
                    "Gudeg adalah makanan khasnya yang paling ikonik",
                    "Memiliki status Daerah Istimewa"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "MEDAN",
                "hints": [
                    "Ibu kota provinsi Sumatera Utara",
                    "Terkenal dengan Danau Toba di dekatnya",
                    "Memiliki istana bersejarah bernama Istana Maimun",
                    "Bika Ambon adalah oleh-oleh terkenalnya (meski bukan dari Ambon)",
                    "Kota terbesar ketiga di Indonesia"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "DENPASAR",
                "hints": [
                    "Pintu gerbang utama pariwisata Indonesia",
                    "Ibu kota provinsi Bali",
                    "Terkenal dengan Pantai Sanur",
                    "Pusat pemerintahan di Pulau Dewata",
                    "Bandaranya bernama I Gusti Ngurah Rai"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "MAKASSAR",
                "hints": [
                    "Dulu bernama Ujung Pandang",
                    "Terkenal dengan Pantai Losari",
                    "Kuliner khasnya Coto dan Konro",
                    "Gerbang utama menuju Indonesia Timur",
                    "Ibu kota provinsi Sulawesi Selatan"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SEMARANG",
                "hints": [
                    "Ibu kota provinsi Jawa Tengah",
                    "Terkenal dengan bangunan Lawang Sewu",
                    "Identik dengan kuliner lumpia dan bandeng presto",
                    "Memiliki kawasan Kota Lama peninggalan Belanda",
                    "Pelabuhannya bernama Tanjung Emas"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PALEMBANG",
                "hints": [
                    "Terkenal dengan Jembatan Ampera yang melintasi Sungai Musi",
                    "Pempek adalah makanan yang wajib dicoba di sini",
                    "Pernah menjadi pusat Kerajaan Sriwijaya",
                    "Tuan rumah Asian Games 2018 bersama Jakarta",
                    "Memiliki moda transportasi LRT pertama di Indonesia"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BOGOR",
                "hints": [
                    "Dijuluki sebagai Kota Hujan",
                    "Memiliki Kebun Raya yang sangat luas dan tua",
                    "Terdapat Istana Kepresidenan yang dihuni banyak rusa",
                    "Terkenal dengan kuliner asinan dan talas",
                    "Letaknya tidak jauh di selatan Jakarta"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "MALANG",
                "hints": [
                    "Dikelilingi pegunungan dan berhawa sejuk",
                    "Terkenal dengan buah apel",
                    "Bahasa walikan (dibalik) populer di kalangan anak mudanya",
                    "Memiliki klub sepak bola berjuluk Singo Edan",
                    "Gerbang menuju wisata Gunung Bromo"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SOLO",
                "hints": [
                    "Nama resminya adalah Surakarta",
                    "Kota kelahiran Presiden Joko Widodo",
                    "Pusat batik dan budaya Jawa selain Yogyakarta",
                    "Terkenal dengan pasar tekstil Klewer",
                    "Memiliki slogan 'The Spirit of Java'"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BATAM",
                "hints": [
                    "Hanya berjarak sangat dekat dengan negara Singapura",
                    "Merupakan kawasan perdagangan bebas (FTZ)",
                    "Terkenal dengan jembatan Barelang",
                    "Kota industri dan elektronik yang sibuk di Kepri",
                    "Banyak wisatawan menyeberang menggunakan kapal feri"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BANDA ACEH",
                "hints": [
                    "Kota paling ujung barat di pulau Sumatera",
                    "Dijuluki Serambi Mekkah",
                    "Memiliki Museum Tsunami sebagai peringatan bencana 2004",
                    "Terkenal dengan Masjid Raya Baiturrahman yang megah",
                    "Berlaku hukum syariat Islam secara formal"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "JAYAPURA",
                "hints": [
                    "Ibu kota provinsi Papua",
                    "Terletak di teluk yang indah di utara pulau",
                    "Kota terbesar di bagian paling timur Indonesia",
                    "Berbatasan langsung dengan negara Papua Nugini",
                    "Memiliki jembatan merah megah di atas Teluk Youtefa"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "MANADO",
                "hints": [
                    "Terkenal dengan wisata taman laut Bunaken",
                    "Memiliki kuliner yang sangat pedas (rica-rica)",
                    "Mayoritas penduduknya beragama Nasrani",
                    "Berada di ujung utara pulau Sulawesi",
                    "Terkenal dengan bubur tinutuan"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PADANG",
                "hints": [
                    "Ibu kota Sumatera Barat",
                    "Masakan dari kota ini ada di seluruh penjuru Indonesia",
                    "Terkenal dengan legenda Siti Nurbaya dan Gunung Padang",
                    "Rumah adatnya memiliki atap bergonjong runcing (Rumah Gadang)",
                    "Pantai Air Manis memiliki batu legenda Malin Kundang"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PONTIANAK",
                "hints": [
                    "Dilalui tepat oleh Garis Khatulistiwa",
                    "Memiliki tugu Equator yang terkenal",
                    "Dibelah oleh Sungai Kapuas yang sangat lebar",
                    "Namanya dikaitkan dengan legenda hantu perempuan",
                    "Terkenal dengan kuliner kwetiau dan pisang goreng srikaya"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "AMBON",
                "hints": [
                    "Dijuluki sebagai 'Manise'",
                    "Ibu kota provinsi Maluku",
                    "Terkenal sebagai kota musik dunia versi UNESCO",
                    "Memiliki teluk yang sangat indah",
                    "Identik dengan rempah-rempah di masa lalu"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BALIKPAPAN",
                "hints": [
                    "Dikenal sebagai 'Kota Minyak' di Kalimantan",
                    "Salah satu kota dengan biaya hidup termahal di Indonesia",
                    "Gerbang utama menuju calon ibu kota baru (IKN)",
                    "Memiliki kilang minyak besar di tepi pantai",
                    "Terkenal sangat bersih dan tertata rapi"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PEKANBARU",
                "hints": [
                    "Ibu kota provinsi Riau",
                    "Pusat perdagangan kelapa sawit dan minyak bumi",
                    "Tumbuh pesat dari kota kecil menjadi kota metropolitan",
                    "Dialiri oleh Sungai Siak",
                    "Terkenal dengan Jembatan Siak yang megah"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BANDAR LAMPUNG",
                "hints": [
                    "Gerbang utama pulau Sumatera dari arah Jawa",
                    "Terkenal sebagai produsen kopi robusta dan pisang",
                    "Memiliki ikon Menara Siger di titik nol Sumatera",
                    "Gabungan dari dua kota lama: Tanjungkarang dan Telukbetung",
                    "Terkenal dengan suaka gajah Way Kambas (di dekatnya)"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SAMARINDA",
                "hints": [
                    "Ibu kota provinsi Kalimantan Timur",
                    "Terkenal dengan kain sarung tenunnya",
                    "Dibelah oleh Sungai Mahakam",
                    "Pusat industri kayu dan tambang batubara",
                    "Memiliki masjid Islamic Center yang sangat besar di tepian sungai"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BANJARMASIN",
                "hints": [
                    "Dijuluki Kota Seribu Sungai",
                    "Terkenal dengan pasar terapung tradisionalnya",
                    "Maskotnya adalah kera hidung panjang (Bekantan)",
                    "Ibu kota provinsi Kalimantan Selatan (sebelum dipindah)",
                    "Memiliki kuliner Soto Banjar yang khas"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "MATARAM",
                "hints": [
                    "Ibu kota provinsi Nusa Tenggara Barat",
                    "Berada di pulau Lombok",
                    "Sering disebut sebagai pulau 'Seribu Masjid'",
                    "Dekat dengan kawasan wisata Senggigi",
                    "Nama kotanya sama dengan nama kerajaan kuno di Jawa"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KUPANG",
                "hints": [
                    "Ibu kota provinsi Nusa Tenggara Timur",
                    "Berada di bagian barat pulau Timor",
                    "Memiliki iklim yang cukup kering dan panas",
                    "Terkenal dengan alat musik Sasando",
                    "Pohon lontar banyak tumbuh di daerah ini"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "CIREBON",
                "hints": [
                    "Dijuluki sebagai Kota Udang",
                    "Berada di perbatasan Jawa Barat dan Jawa Tengah",
                    "Terkenal dengan motif batik Megamendung (awan)",
                    "Pusat penyebaran Islam oleh Sunan Gunung Jati",
                    "Kuliner khasnya tahu gejrot dan nasi jamblang"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KEDIRI",
                "hints": [
                    "Terkenal sebagai pusat industri rokok terbesar (Gudang Garam)",
                    "Tahu kuning adalah oleh-oleh khasnya",
                    "Pernah ada kerajaan besar dengan nama yang sama di masa lalu",
                    "Memiliki monumen Simpang Lima Gumul yang mirip Arc de Triomphe Paris",
                    "Berada di Jawa Timur, dibelah sungai Brantas"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BATU",
                "hints": [
                    "Dulu merupakan bagian dari Kabupaten Malang",
                    "Terkenal sebagai Kota Apel",
                    "Pusat wisata theme park (Jatim Park, Museum Angkut)",
                    "Berhawa sangat sejuk karena berada di ketinggian",
                    "Sering disebut sebagai 'Swiss kecil di Pulau Jawa'"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BUKITTINGGI",
                "hints": [
                    "Pernah menjadi ibu kota darurat Indonesia (PDRI)",
                    "Ikon utamanya adalah Jam Gadang",
                    "Berhawa sejuk dan dikelilingi gunung berapi (Marapi, Singgalang)",
                    "Terkenal dengan Ngarai Sianok yang indah",
                    "Kota kelahiran Bung Hatta"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "JAMBI",
                "hints": [
                    "Ibu kota provinsi yang namanya sama dengan nama kotanya",
                    "Dibelah oleh sungai terpanjang di Sumatera (Batanghari)",
                    "Dekat dengan situs candi terluas di Asia Tenggara (Muaro Jambi)",
                    "Identik dengan Gunung Kerinci (gunung berapi tertinggi di Indonesia)",
                    "Suku Anak Dalam banyak mendiami wilayah provinsinya"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BENGKULU",
                "hints": [
                    "Tempat pengasingan Bung Karno oleh Belanda",
                    "Rumah bagi bunga Rafflesia Arnoldii",
                    "Memiliki benteng Inggris terbesar di Asia (Fort Marlborough)",
                    "Ibu Fatmawati (penjahit bendera pusaka) berasal dari sini",
                    "Terletak di pesisir barat pulau Sumatera"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PALU",
                "hints": [
                    "Ibu kota Sulawesi Tengah",
                    "Pernah diterjang tsunami dan likuifaksi dahsyat pada 2018",
                    "Terletak di teluk yang dalam dan sempit",
                    "Memiliki jembatan kuning ikonik (sebelum runtuh karena gempa)",
                    "Terkenal dengan bawang gorengnya yang renyah"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KENDARI",
                "hints": [
                    "Ibu kota Sulawesi Tenggara",
                    "Pusat industri nikel dan tambang",
                    "Terkenal dengan kerajinan perak",
                    "Gerbang menuju wisata Wakatobi",
                    "Makanan khasnya adalah Sinonggi (mirip papeda)"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PANGKALPINANG",
                "hints": [
                    "Ibu kota provinsi Kepulauan Bangka Belitung",
                    "Berada di pulau Bangka",
                    "Identik dengan sejarah pertambangan timah",
                    "Terkenal dengan kuliner otak-otak dan terasi",
                    "Memiliki pantai Pasir Padi"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "TANJUNGPINANG",
                "hints": [
                    "Ibu kota provinsi Kepulauan Riau (bukan Batam)",
                    "Berada di Pulau Bintan",
                    "Terkenal dengan pulau bersejarah Pulau Penyengat",
                    "Pusat kebudayaan Melayu Riau Lingga",
                    "Gonggong (siput laut) adalah makanan khasnya"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "TEGAL",
                "hints": [
                    "Terkenal dengan 'warteg' (warung makan) yang menjamur di mana-mana",
                    "Memiliki dialek bahasa Jawa yang sangat khas ('ngapak')",
                    "Berada di jalur pantura Jawa Tengah",
                    "Identik dengan teh poci dan gula batu",
                    "Sering dijuluki Kota Bahari"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PEKALONGAN",
                "hints": [
                    "Menyandang predikat sebagai Kota Batik dunia dari UNESCO",
                    "Pusat industri tekstil kreatif di Jawa Tengah",
                    "Memiliki Museum Batik Nasional",
                    "Berada di jalur utama Pantura",
                    "Kuliner khasnya adalah Nasi Megono"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "MADIUN",
                "hints": [
                    "Terkenal dengan makanan sambal pecel",
                    "Pusat industri kereta api Indonesia (PT INKA)",
                    "Dikenal sebagai Kota Gadis (perdagangan, pendidikan, industri)",
                    "Pernah menjadi pusat pemberontakan PKI 1948",
                    "Juga dikenal sebagai pusat perguruan pencak silat"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PURWOKERTO",
                "hints": [
                    "Kota yang terkenal dengan keripik tempe dan mendoan",
                    "Gerbang utama pendakian Gunung Slamet",
                    "Pusat bahasa Jawa dialek Banyumasan (Ngapak)",
                    "Sebenarnya bukan kota otonom, tapi ibu kota kabupaten (Banyumas)",
                    "Memiliki kawasan wisata Baturaden"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SABANG",
                "hints": [
                    "Kota yang berada di paling ujung barat Indonesia (Pulau Weh)",
                    "Tugu Nol Kilometer Indonesia ada di sini",
                    "Memiliki pelabuhan bebas yang strategis",
                    "Terkenal dengan wisata selam dan pantai Iboih",
                    "Namanya sering disebut dalam lagu nasional (Dari ... sampai Merauke)"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "DUMAI",
                "hints": [
                    "Kota pelabuhan dan industri minyak utama di Riau",
                    "Salah satu kota terluas di Indonesia (karena wilayah administrasinya)",
                    "Titik keberangkatan kapal feri internasional ke Malaysia (Melaka)",
                    "Tumbuh dari sebuah dusun kecil nelayan",
                    "Terkenal dengan kilang minyak Pertamina Putri Tujuh"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SAWAHLUNTO",
                "hints": [
                    "Kota warisan budaya UNESCO di Sumatera Barat",
                    "Terkenal dengan sejarah tambang batubara Ombilin",
                    "Kota tua yang terletak di lembah berbentuk kuali",
                    "Memiliki lubang tambang bersejarah 'Mbah Soero'",
                    "Dulu disebut 'Kota Arang' oleh Belanda"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SIBOLGA",
                "hints": [
                    "Kota pelabuhan kecil di pantai barat Sumatera Utara",
                    "Pintu gerbang menuju Pulau Nias via laut",
                    "Kota terkecil di Indonesia berdasarkan luas wilayah daratan",
                    "Terkenal dengan julukan 'Kota Ikan'",
                    "Berada di teluk yang bernama sama (Teluk Tapian Nauli)"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "METRO",
                "hints": [
                    "Kota terbesar kedua di provinsi Lampung",
                    "Awalnya dibangun sebagai kota untuk kolonisasi (transmigrasi) Belanda",
                    "Dijuluki Kota Pendidikan di Lampung",
                    "Namanya terdengar sangat modern untuk kota kecil",
                    "Tata kotanya rapi dengan banyak taman"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SALATIGA",
                "hints": [
                    "Disebut sebagai salah satu kota paling toleran di Indonesia",
                    "Berada di kaki Gunung Merbabu, berhawa sejuk",
                    "Terletak strategis di antara Semarang dan Solo",
                    "Terkenal dengan universitas swasta Kristen yang tua (UKSW)",
                    "Kuliner khasnya enting-enting gepuk"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "MAGELANG",
                "hints": [
                    "Candi Borobudur sering dikira ada di kota ini (padahal di kabupatennya)",
                    "Dikepung oleh lima gunung sekaligus",
                    "Lokasi Akademi Militer (Akmil) TNI AD",
                    "Memiliki tempat wisata bukit bernama Tidar (Paku Tanah Jawa)",
                    "Getuk Trio adalah oleh-oleh terkenalnya"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BLITAR",
                "hints": [
                    "Kota tempat dimakamkannya Presiden Soekarno",
                    "Sering dijuluki Kota Proklamator",
                    "Identik dengan Gunung Kelud",
                    "Memiliki banyak candi peninggalan Majapahit (Penataran)",
                    "Terletak di bagian selatan Jawa Timur"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "MOJOKERTO",
                "hints": [
                    "Pernah menjadi ibu kota Kerajaan Majapahit (di Trowulan dekatnya)",
                    "Terkenal dengan kuliner onde-onde",
                    "Kota penyangga industri utama bagi Surabaya",
                    "Salah satu kota terkecil di Jawa Timur secara wilayah",
                    "Banyak ditemukan situs purbakala di sekitarnya"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PROBOLINGGO",
                "hints": [
                    "Terkenal dengan buah mangga dan anggurnya",
                    "Kota transit utama menuju Gunung Bromo selain Malang",
                    "Memiliki pelabuhan perikanan yang besar",
                    "Berada di jalur pantura timur Jawa",
                    "Memiliki komunitas etnis Madura yang besar"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SINGKAWANG",
                "hints": [
                    "Dijuluki Kota Seribu Kuil/Kelenteng",
                    "Perayaan Cap Go Meh-nya paling meriah se-Asia Tenggara",
                    "Mayoritas penduduknya etnis Tionghoa (Hakka)",
                    "Terletak di Kalimantan Barat dekat pantai",
                    "Terkenal dengan keramik tradisionalnya"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BONTANG",
                "hints": [
                    "Kota industri kaya di Kalimantan Timur",
                    "Basis perusahaan besar pupuk (PKT) dan gas alam (Badak LNG)",
                    "Salah satu kota dengan PDRB per kapita tertinggi di Indonesia",
                    "Awalnya hanya perkampungan nelayan kecil",
                    "Sangat bergantung pada sektor migas"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "TARAKAN",
                "hints": [
                    "Kota pulau di utara Kalimantan Utara",
                    "Memiliki sejarah pertempuran minyak saat Perang Dunia II",
                    "Satu-satunya kota di provinsi termuda Indonesia (Kaltara)",
                    "Dijuluki 'Bumi Paguntaka'",
                    "Terkenal dengan kawasan konservasi mangrove dan bekantan di tengah kota"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BANJARBARU",
                "hints": [
                    "Ibu kota provinsi Kalimantan Selatan yang baru (menggantikan Banjarmasin)",
                    "Awalnya dirancang sebagai kota pelajar dan permukiman",
                    "Terkenal dengan pendulangan intan tradisional (Cempaka)",
                    "Bandara utama Kalsel (Syamsudin Noor) terletak di sini",
                    "Tanahnya didominasi oleh lahan gambut dan berpasir"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "TERNATE",
                "hints": [
                    "Kota pulau yang terletak tepat di kaki gunung berapi Gamalama",
                    "Pusat kesultanan Islam berpengaruh di Indonesia Timur",
                    "Dulu menjadi rebutan bangsa Eropa karena cengkih",
                    "Gambarnya ada di uang kertas pecahan Rp1.000",
                    "Memiliki banyak benteng peninggalan Portugis dan Belanda"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "TIDORE",
                "hints": [
                    "Kota kepulauan yang menjadi 'saudara kembar' Ternate",
                    "Memiliki wilayah laut yang sangat luas",
                    "Pernah menjadi ibu kota provinsi Irian Barat (perjuangan)",
                    "Kesultanannya dulu menguasai hingga wilayah Papua",
                    "Suasananya jauh lebih tenang dibanding Ternate"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SORONG",
                "hints": [
                    "Gerbang utama menuju wisata Raja Ampat",
                    "Kota industri minyak dan gas di Papua Barat Daya",
                    "Dijuluki 'Kota Minyak' di tanah Papua",
                    "Salah satu kota dengan biaya hidup termahal di timur",
                    "Pelabuhannya sangat sibuk melayani kapal penumpang"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BAUBAU",
                "hints": [
                    "Terletak di Pulau Buton, Sulawesi Tenggara",
                    "Memiliki benteng terluas di dunia (Benteng Keraton Buton)",
                    "Pernah menggunakan huruf Korea (Hangul) untuk bahasa daerahnya",
                    "Pusat sejarah Kesultanan Buton",
                    "Terkenal dengan aspal alamnya"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BITUNG",
                "hints": [
                    "Kota pelabuhan internasional di ujung Sulawesi Utara",
                    "Terkenal dengan industri perikanan tuna/cakalang",
                    "Dekat dengan Cagar Alam Tangkoko (rumah Tarsius)",
                    "Memiliki Selat Lembeh yang terkenal untuk 'muck diving'",
                    "Dijuluki Kota Cakalang"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PAREPARE",
                "hints": [
                    "Kota kelahiran Presiden B.J. Habibie",
                    "Kota pelabuhan utama kedua di Sulawesi Selatan setelah Makassar",
                    "Memiliki monumen Cinta Habibie Ainun",
                    "Terletak di sebuah teluk di pantai barat Sulawesi",
                    "Menjadi jalur transit utama ke Tana Toraja"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            }
        ],
        "profesi": [
            {
                "word": "GURU",
                "hints": [
                    "Pahlawan tanpa tanda jasa",
                    "Digugu dan ditiru",
                    "Bekerja di sekolah atau institusi pendidikan",
                    "Menggunakan spidol atau kapur tulis saat bekerja",
                    "Memberikan PR dan ujian kepada murid"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "DOKTER",
                "hints": [
                    "Mengucapkan sumpah Hipokrates sebelum bertugas",
                    "Identik dengan jas berwarna putih",
                    "Menggunakan stetoskop untuk memeriksa pasien",
                    "Tempat kerjanya di rumah sakit atau puskesmas",
                    "Menulis resep obat yang sulit dibaca orang awam"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "POLISI",
                "hints": [
                    "Mengayomi dan melindungi masyarakat",
                    "Identik dengan seragam cokelat di Indonesia",
                    "Membawa borgol dan pistol",
                    "Sering mengatur lalu lintas di jalan raya",
                    "Bisa menilang pengendara yang melanggar aturan"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KOKI",
                "hints": [
                    "Sering mengenakan topi putih tinggi",
                    "Ahli dalam meracik bumbu dan bahan makanan",
                    "Bahasa kerennya adalah Chef",
                    "Bekerja di dapur restoran atau hotel",
                    "Senjatanya adalah pisau dan wajan"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PILOT",
                "hints": [
                    "Bekerja di dalam kokpit",
                    "Mengemudikan burung besi",
                    "Harus memiliki jam terbang tinggi",
                    "Berkomunikasi dengan menara pengawas (ATC)",
                    "Identik dengan seragam putih dan kacamata hitam"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PETANI",
                "hints": [
                    "Ujung tombak ketahanan pangan negara",
                    "Bekerja di sawah atau ladang",
                    "Identik dengan topi caping dari anyaman bambu",
                    "Menggunakan cangkul atau traktor",
                    "Menanam padi, jagung, atau sayuran"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "NELAYAN",
                "hints": [
                    "Pergi bekerja saat matahari terbenam",
                    "Pulang bekerja saat matahari terbit",
                    "Menggunakan jala atau pancing",
                    "Menghadapi ombak di laut demi tangkapan",
                    "Bau amis sudah menjadi temannya sehari-hari"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "TENTARA",
                "hints": [
                    "Bertugas mempertahankan kedaulatan negara",
                    "Identik dengan seragam motif loreng",
                    "Membawa senjata api laras panjang",
                    "Tinggal di barak atau asrama",
                    "Memiliki disiplin yang sangat tinggi dan tegas"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PEMADAM",
                "hints": [
                    "Pantang pulang sebelum padam",
                    "Mengendarai truk merah dengan sirine nyaring",
                    "Menggunakan selang air bertekanan tinggi",
                    "Memakai baju tahan api yang tebal",
                    "Sering diminta tolong mengevakuasi hewan liar juga"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "MASINIS",
                "hints": [
                    "Pengemudi angkutan darat terpanjang",
                    "Berjalan di atas rel besi",
                    "Berhenti hanya di stasiun",
                    "Membunyikan klakson lokomotif yang keras",
                    "Bertanggung jawab atas ribuan penumpang kereta"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "WASIT",
                "hints": [
                    "Pengadil di lapangan olahraga",
                    "Meniup peluit untuk menghentikan permainan",
                    "Bisa memberikan kartu kuning atau merah",
                    "Harus bersikap netral tidak memihak",
                    "Sering diprotes oleh pemain yang tidak puas"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SOPIR",
                "hints": [
                    "Mengendalikan roda kemudi kendaraan",
                    "Harus memiliki Surat Izin Mengemudi (SIM)",
                    "Bisa mengendarai taksi, bus, atau angkot",
                    "Paham rute jalan dan rambu lalu lintas",
                    "Membawa penumpang sampai tujuan"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PELUKIS",
                "hints": [
                    "Seniman yang menggunakan kanvas",
                    "Alat utamanya kuas dan palet cat",
                    "Karyanya bisa dipajang di galeri atau museum",
                    "Mencampurkan warna untuk menciptakan gambar",
                    "Identik dengan topi beret dan celemek belepotan"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PENYANYI",
                "hints": [
                    "Menghibur orang dengan suaranya",
                    "Memegang mikrofon di atas panggung",
                    "Bisa tampil solo, duet, atau grup band",
                    "Mengeluarkan album atau single lagu",
                    "Sering menggelar konser musik"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ATLET",
                "hints": [
                    "Berlatih fisik sangat keras setiap hari",
                    "Berkompetisi di ajang olahraga (seperti Olimpiade)",
                    "Menjunjung tinggi sportivitas",
                    "Mengejar medali emas",
                    "Memakai jersey atau seragam tim"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PERAWAT",
                "hints": [
                    "Mitra kerja dokter di rumah sakit",
                    "Sering disebut Suster atau Bruder",
                    "Merawat pasien rawat inap sehari-hari",
                    "Membantu menyuntik atau memasang infus",
                    "Identik dengan seragam putih bersih"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PENJAHIT",
                "hints": [
                    "Ahli dalam menyatukan kain",
                    "Alatnya adalah jarum, benang, dan mesin khusus",
                    "Mengukur lingkar badan pelanggan dengan meteran pita",
                    "Membuat pola pakaian sebelum memotong bahan",
                    "Bisa memperbaiki baju yang sobek"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PEDAGANG",
                "hints": [
                    "Melakukan transaksi jual beli",
                    "Bisa ditemukan di pasar tradisional maupun toko modern",
                    "Tujuannya mencari keuntungan (laba)",
                    "Menawarkan barang dagangan kepada pembeli",
                    "Sering melakukan tawar-menawar harga"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "TUKANG POS",
                "hints": [
                    "Mengantar surat dan paket ke rumah-rumah",
                    "Identik dengan kendaraan berwarna oranye di Indonesia",
                    "Dulu sangat sibuk saat menjelang Lebaran (kartu ucapan)",
                    "Bekerja untuk perusahaan logistik negara",
                    "Mengenal alamat rumah dengan sangat baik"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "TUKANG KAYU",
                "hints": [
                    "Mengolah batang pohon menjadi perabot",
                    "Alat andalannya gergaji, palu, dan paku",
                    "Bisa membuat meja, kursi, atau lemari",
                    "Bekerja dengan banyak serbuk gergaji",
                    "Menghaluskan permukaan dengan alat serut"
                ],
                "level": "mudah",
                "maxScore": 3,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ARSITEK",
                "hints": [
                    "Merancang desain bangunan sebelum dibuat",
                    "Sering membawa tabung gambar berisi kertas biru (blueprint)",
                    "Membuat maket miniatur gedung",
                    "Menggabungkan seni dan teknik sipil",
                    "Menghitung skala dan ukuran ruangan dengan presisi"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "WARTAWAN",
                "hints": [
                    "Memburu berita terbaru",
                    "Sering disebut kuli tinta",
                    "Mewawancarai narasumber penting",
                    "Bekerja di media cetak, elektronik, atau online",
                    "Harus mematuhi kode etik jurnalistik"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "APOTEKER",
                "hints": [
                    "Ahli dalam meracik obat-obatan",
                    "Bekerja di belakang etalase toko obat",
                    "Paham tentang dosis dan efek samping kimia",
                    "Bisa membaca tulisan resep dokter yang sulit",
                    "Lulusan dari jurusan Farmasi"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "HAKIM",
                "hints": [
                    "Memimpin jalannya persidangan di pengadilan",
                    "Dipanggil 'Yang Mulia' saat bertugas",
                    "Mengenakan jubah hitam dan dasi putih",
                    "Mengetuk palu untuk mengambil keputusan vonis",
                    "Simbol keadilan di meja hijau"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PENGACARA",
                "hints": [
                    "Membela klien yang terlibat masalah hukum",
                    "Sering disebut advokat atau lawyer",
                    "Pandai berdebat dan berargumen di sidang",
                    "Paham pasal-pasal dalam undang-undang",
                    "Bisa dibayar sangat mahal untuk kasus besar"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "DOSEN",
                "hints": [
                    "Mengajar mahasiswa di universitas",
                    "Memiliki gelar minimal S2 (Magister)",
                    "Melakukan penelitian dan pengabdian masyarakat (Tri Dharma)",
                    "Membimbing penyusunan skripsi/tesis",
                    "Dipanggil 'Pak' atau 'Bu' di kampus"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "NAKHODA",
                "hints": [
                    "Pemimpin tertinggi di atas kapal laut",
                    "Bertanggung jawab penuh atas keselamatan pelayaran",
                    "Sering disebut Kapten Kapal",
                    "Menguasai ilmu navigasi laut",
                    "Orang terakhir yang boleh meninggalkan kapal saat darurat"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PRAMUGARI",
                "hints": [
                    "Melayani penumpang di dalam pesawat terbang",
                    "Memperagakan cara penggunaan alat keselamatan sebelum terbang",
                    "Identik dengan seragam rapi dan menarik",
                    "Menyajikan makanan dan minuman di udara",
                    "Harus tetap tenang saat pesawat mengalami turbulensi"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "MONTIR",
                "hints": [
                    "Dokternya kendaraan bermotor",
                    "Bekerja di bengkel",
                    "Tangannya sering kotor terkena oli mesin",
                    "Menggunakan kunci inggris, obeng, dan dongkrak",
                    "Memperbaiki mesin yang mogok"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "FOTOGRAFER",
                "hints": [
                    "Mengabadikan momen lewat lensa",
                    "Selalu membawa kamera profesional",
                    "Paham tentang pencahayaan (lighting) dan komposisi",
                    "Bekerja di studio atau lapangan (outdoor)",
                    "Karyanya bisa bernilai seni tinggi"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PENULIS",
                "hints": [
                    "Merangkai kata menjadi sebuah karya",
                    "Bisa membuat novel, cerpen, atau artikel",
                    "Sering mengalami 'writer's block' (buntu ide)",
                    "Mendapatkan royalti dari penjualan bukunya",
                    "Bekerja dengan imajinasi atau riset"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SUTRADARA",
                "hints": [
                    "Orang yang paling berkuasa di lokasi syuting film",
                    "Meneriakkan kata 'Action!' dan 'Cut!'",
                    "Mengarahkan aktor dan aktris dalam beradegan",
                    "Mewujudkan visi dari sebuah naskah skenario",
                    "Duduk di kursi khusus di belakang monitor"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PSIKOLOG",
                "hints": [
                    "Ahli dalam memahami perilaku dan mental manusia",
                    "Tempat curhat profesional",
                    "Tidak boleh meresepkan obat (berbeda dengan psikiater)",
                    "Melakukan konseling dan tes kepribadian",
                    "Membantu orang mengatasi masalah mentalnya"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BIDAN",
                "hints": [
                    "Membantu ibu hamil saat proses melahirkan",
                    "Memantau kesehatan ibu dan bayi baru lahir",
                    "Sering membuka praktik di desa-desa",
                    "Pendidikan khususnya adalah kebidanan",
                    "Mitra perempuan dalam kesehatan reproduksi"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "AKUNTAN",
                "hints": [
                    "Ahli dalam menghitung dan mencatat keuangan",
                    "Membuat laporan neraca laba rugi",
                    "Bekerja dengan banyak angka dan tabel",
                    "Memastikan tidak ada kecurangan dalam keuangan perusahaan",
                    "Sangat teliti dan detail oriented"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SEKRETARIS",
                "hints": [
                    "Asisten pribadi pimpinan di kantor",
                    "Mengatur jadwal rapat dan pertemuan bos",
                    "Menangani surat-menyurat dan telepon masuk",
                    "Menjaga rahasia perusahaan dan atasan",
                    "Sangat terorganisir dan rapi dalam administrasi"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PENERJEMAH",
                "hints": [
                    "Menguasai lebih dari satu bahasa dengan fasih",
                    "Mengubah teks atau ucapan dari satu bahasa ke bahasa lain",
                    "Sering dibutuhkan dalam konferensi internasional",
                    "Bisa juga menerjemahkan buku atau subtitle film",
                    "Disebut juga translator atau interpreter"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "MODEL",
                "hints": [
                    "Memperagakan busana rancangan desainer",
                    "Berjalan di atas catwalk (runway)",
                    "Menjadi objek foto untuk iklan produk",
                    "Harus pandai berpose di depan kamera",
                    "Menjaga bentuk tubuh dan penampilan adalah tuntutan kerjanya"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PROGRAMMER",
                "hints": [
                    "Menulis kode bahasa yang hanya dimengerti komputer",
                    "Membangun aplikasi atau perangkat lunak (software)",
                    "Sering bekerja di depan layar monitor ganda",
                    "Menghabiskan banyak waktu untuk mencari 'bug' (kesalahan kode)",
                    "Menguasai bahasa seperti Python, Java, atau C++"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KURIR",
                "hints": [
                    "Sangat dinanti kedatangannya oleh pembeli online",
                    "Mengantarkan paket sampai ke depan pintu",
                    "Meneriakkan kata 'Paket!' saat tiba",
                    "Bekerja mengendarai motor dengan tas besar di belakang",
                    "Harus memastikan barang diterima oleh orang yang tepat"
                ],
                "level": "sedang",
                "maxScore": 8,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BARISTA",
                "hints": [
                    "Seniman peracik minuman kopi",
                    "Bekerja di balik mesin espresso",
                    "Bisa menggambar pola indah di atas buih susu (latte art)",
                    "Paham perbedaan biji arabika dan robusta",
                    "Identik dengan apron (celemek) yang keren"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ARKEOLOG",
                "hints": [
                    "Mempelajari sejarah masa lalu lewat benda kuno",
                    "Sering melakukan penggalian (ekskavasi) di situs bersejarah",
                    "Mencari fosil atau artefak yang terkubur",
                    "Bekerja dengan kuas kecil untuk membersihkan temuan",
                    "Seperti tokoh Indiana Jones di film"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ASTRONOM",
                "hints": [
                    "Ilmuwan yang mempelajari benda-benda langit",
                    "Bekerja menggunakan teleskop raksasa",
                    "Mengamati bintang, planet, dan galaksi jauh",
                    "Sering bekerja di observatorium di atas gunung",
                    "Mencari kemungkinan kehidupan lain di luar bumi"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KURATOR",
                "hints": [
                    "Penanggung jawab koleksi benda seni di museum",
                    "Memutuskan benda apa yang layak dipamerkan",
                    "Menjaga dan merawat artefak berharga agar tidak rusak",
                    "Mengatur tema sebuah pameran seni",
                    "Harus memiliki pengetahuan mendalam tentang sejarah seni"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "NOTARIS",
                "hints": [
                    "Pejabat umum yang berwenang membuat akta otentik",
                    "Sangat dibutuhkan saat jual beli tanah atau rumah",
                    "Menyaksikan penandatanganan dokumen penting",
                    "Memiliki cap dan segel resmi yang diakui negara",
                    "Lulusan sarjana hukum dengan pendidikan khusus kenotariatan"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "GEOLOG",
                "hints": [
                    "Ahli tentang bebatuan dan struktur bumi",
                    "Sering bekerja di lokasi pertambangan atau gunung",
                    "Mempelajari lapisan tanah untuk menemukan minyak atau mineral",
                    "Paham tentang potensi gempa dan bencana alam kebumian",
                    "Membawa palu khusus untuk memecah sampel batu"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "AKTUARIS",
                "hints": [
                    "Ahli matematika yang bekerja di industri asuransi",
                    "Menghitung risiko keuangan dan ketidakpastian masa depan",
                    "Menentukan besaran premi yang harus dibayar nasabah",
                    "Profesi yang sangat langka dan bergaji tinggi",
                    "Menggunakan statistik untuk memprediksi umur harapan hidup"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "DUBBER",
                "hints": [
                    "Bekerja menggunakan suaranya tapi wajahnya jarang terlihat",
                    "Disebut juga pengisi suara",
                    "Membuat karakter kartun menjadi 'hidup' dan bisa bicara",
                    "Menggantikan suara aktor asing ke dalam Bahasa Indonesia",
                    "Bekerja di dalam studio rekaman kedap suara"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "STUNTMAN",
                "hints": [
                    "Pemeran pengganti untuk adegan berbahaya",
                    "Rela melompat dari gedung atau terbakar demi film",
                    "Wajahnya tidak boleh terlihat jelas di kamera",
                    "Melindungi aktor utama dari risiko cedera",
                    "Harus memiliki keahlian fisik dan bela diri yang tinggi"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ARSIPARIS",
                "hints": [
                    "Ahli dalam mengelola dokumen-dokumen kuno atau penting",
                    "Bekerja menjaga memori kolektif sebuah bangsa atau organisasi",
                    "Memastikan kertas tua tidak rusak dimakan rayap atau usia",
                    "Mengatur tata letak penyimpanan agar mudah ditemukan kembali",
                    "Bekerja di lembaga kearsipan nasional"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PUSTAKAWAN",
                "hints": [
                    "Penjaga ilmu pengetahuan di perpustakaan",
                    "Ahli dalam mengklasifikasikan buku berdasarkan sistem tertentu",
                    "Membantu pengunjung menemukan referensi yang tepat",
                    "Menjaga suasana agar tetap tenang dan kondusif untuk membaca",
                    "Merawat koleksi buku agar tetap awet"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PIALANG",
                "hints": [
                    "Perantara dalam perdagangan saham di bursa efek",
                    "Sering disebut broker",
                    "Bekerja dengan pergerakan grafik yang sangat cepat di monitor",
                    "Membantu investor membeli atau menjual asetnya",
                    "Stres kerjanya sangat tinggi mengikuti naik turunnya pasar"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "BARTENDER",
                "hints": [
                    "Ahli meracik minuman (seringkali beralkohol) di bar",
                    "Sering melakukan atraksi melempar botol (juggling)",
                    "Bekerja di kehidupan malam",
                    "Mengenal ratusan resep koktail",
                    "Menjadi teman curhat bagi pelanggan yang duduk di meja bar"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "COPYWRITER",
                "hints": [
                    "Menulis teks untuk keperluan iklan atau pemasaran",
                    "Tujuannya membujuk orang untuk membeli produk",
                    "Membuat slogan atau tagline yang menarik dan mudah diingat",
                    "Bekerja di agensi periklanan kreatif",
                    "Karyanya sering kita lihat di baliho atau iklan media sosial"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "WELDER",
                "hints": [
                    "Nama keren untuk tukang las profesional",
                    "Sering bekerja di konstruksi bawah laut atau pipa minyak",
                    "Wajib menggunakan topeng pelindung mata dari cahaya menyilaukan",
                    "Menyambungkan dua logam dengan panas tinggi",
                    "Salah satu pekerjaan teknis dengan bayaran termahal jika bersertifikat"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "ANIMATOR",
                "hints": [
                    "Membuat gambar diam menjadi seolah-olah bergerak",
                    "Pencipta film kartun atau efek visual 3D",
                    "Bekerja frame demi frame (bingkai demi bingkai)",
                    "Membutuhkan komputer dengan spesifikasi sangat tinggi",
                    "Bekerja di industri kreatif digital"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "KONDUKTOR",
                "hints": [
                    "Memimpin sebuah orkestra musik besar",
                    "Berdiri membelakangi penonton saat bekerja",
                    "Membawa tongkat kecil (baton) untuk memberi aba-aba",
                    "Mengatur tempo dan dinamika permainan puluhan musisi",
                    "Tidak mengeluarkan suara, tapi menentukan harmoni"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "DETEKTIF",
                "hints": [
                    "Penyelidik swasta yang disewa perorangan",
                    "Bekerja secara rahasia (undercover) untuk mencari bukti",
                    "Sering menggunakan kaca pembesar sebagai simbolnya",
                    "Tokoh fiksinya yang terkenal adalah Sherlock Holmes",
                    "Memecahkan kasus yang sulit dipecahkan polisi biasa"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "PAWANG",
                "hints": [
                    "Memiliki keahlian khusus mengendalikan hewan buas",
                    "Sering dikaitkan dengan ular atau gajah",
                    "Di Indonesia, ada juga yang dipercaya bisa mengendalikan hujan",
                    "Bekerja menggunakan pendekatan mistis atau keahlian alami",
                    "Sering dibutuhkan saat acara besar di musim hujan"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            },
            {
                "word": "SOMMELIER",
                "hints": [
                    "Ahli pengetahuan tentang minuman anggur (wine)",
                    "Bekerja di restoran mewah kelas atas",
                    "Bisa merekomendasikan wine yang cocok dengan makanan",
                    "Memiliki indra penciuman dan pengecap yang sangat terlatih",
                    "Tahu cara menuang dan menyajikan wine dengan benar"
                ],
                "level": "sulit",
                "maxScore": 15,
                "hintPenalty": { "mudah": 1, "sedang": 3, "sulit": 5 }
            }
        ]
    };
}

// Level konfigurasi
const levels = {
    mudah: { maxErrors: word => word.length, hintPenaltyMultiplier: 1 },
    sedang: { maxErrors: word => word.length, hintPenaltyMultiplier: 3 },
    sulit: { maxErrors: word => word.length, hintPenaltyMultiplier: 5 }
};

// Event Listeners
registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const playerName = playerNameInput.value.trim();
    if (playerName) {
        currentPlayer = playerName;
        playerNameDisplay.textContent = playerName;
        gamePlayerName.textContent = playerName;
        registrationPage.classList.add('hidden');
        categoryPage.classList.remove('hidden');
        currentScoreDisplay.textContent = currentScore;
    }
});

// Pemilihan kategori
document.querySelectorAll('.btn-category').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.btn-category').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        currentCategory = button.dataset.category;
        checkStartGameEnabled();
    });
});

// Pemilihan level
document.querySelectorAll('.btn-level').forEach(button => {
    button.addEventListener('click', () => {
        const clickedLevel = button.dataset.level;

        // Cek apakah level ini sudah selesai sempurna (semua soal diselesaikan)
        if (completedQuestions[currentCategory] && completedQuestions[currentCategory][clickedLevel]) {
            // Hitung total soal di level ini
            const categoryWords = categories[currentCategory] || [];
            const levelWords = categoryWords.filter(wordObj => wordObj.level === clickedLevel);
            const completedInThisLevel = completedQuestions[currentCategory][clickedLevel] || [];

            // Jika semua soal di level ini telah berhasil diselesaikan, mencegah pemilihan kembali
            if (completedInThisLevel.length > 0 && completedInThisLevel.length >= levelWords.length && levelWords.length > 0) {
                alert(`Anda telah menyelesaikan semua soal di level ${capitalizeFirstLetter(clickedLevel)} kategori ${capitalizeFirstLetter(currentCategory)}. Silakan pilih level yang berbeda.`);
                return;
            }
        }

        // Cek apakah level yang lebih tinggi telah diakses - mencegah pemilihan level yang lebih rendah
        if (levelAccessed[currentCategory]) {
            const levelOrder = ['mudah', 'sedang', 'sulit'];
            const clickedLevelIndex = levelOrder.indexOf(clickedLevel);

            // Jika ada level yang lebih tinggi yang telah diakses, tidak boleh memilih level yang lebih rendah
            for (let i = clickedLevelIndex + 1; i < levelOrder.length; i++) {
                const higherLevel = levelOrder[i];
                if (levelAccessed[currentCategory][higherLevel]) {
                    alert(`Anda telah mengakses level ${capitalizeFirstLetter(higherLevel)} di kategori ${capitalizeFirstLetter(currentCategory)}, silakan pilih level ${capitalizeFirstLetter(higherLevel)} atau yang lebih rendah.`);
                    return;
                }
            }
        }

        document.querySelectorAll('.btn-level').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        currentLevel = clickedLevel;
        checkStartGameEnabled();
    });
});

// Cek apakah tombol mulai permainan bisa diaktifkan
function checkStartGameEnabled() {
    if (currentCategory && currentLevel) {
        startGameBtn.disabled = false;
    } else {
        startGameBtn.disabled = true;
    }
}

// Event listener untuk tombol mulai permainan
startGameBtn.addEventListener('click', () => {
    if (currentCategory && currentLevel) {
        // Tandai bahwa level ini telah diakses
        if (!levelAccessed[currentCategory]) {
            levelAccessed[currentCategory] = {};
        }
        levelAccessed[currentCategory][currentLevel] = true;

        // Cek apakah level ini sudah selesai sempurna (semua soal diselesaikan)
        if (completedQuestions[currentCategory] && completedQuestions[currentCategory][currentLevel]) {
            // Hitung total soal di level ini
            const categoryWords = categories[currentCategory] || [];
            const levelWords = categoryWords.filter(wordObj => wordObj.level === currentLevel);
            const completedInThisLevel = completedQuestions[currentCategory][currentLevel] || [];

            // Jika semua soal di level ini telah berhasil diselesaikan, mencegah pemilihan kembali
            if (completedInThisLevel.length > 0 && completedInThisLevel.length >= levelWords.length && levelWords.length > 0) {
                alert(`Anda telah menyelesaikan semua soal di level ${capitalizeFirstLetter(currentLevel)} kategori ${capitalizeFirstLetter(currentCategory)}. Silakan pilih level yang berbeda.`);
                return;
            }
        }

        // Reset daftar soal yang telah diselesaikan saat memulai permainan baru
        if (!completedQuestions[currentCategory]) completedQuestions[currentCategory] = {};
        if (!completedQuestions[currentCategory][currentLevel]) completedQuestions[currentCategory][currentLevel] = [];
        currentScoreDisplay.textContent = currentScore; // Perbarui tampilan skor sebelum memulai permainan
        startGame();
    }
});

// Event listener untuk tebakan huruf
submitGuessBtn.addEventListener('click', makeGuess);
guessInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        makeGuess();
    }
});

// Event listener untuk hint
useHintBtn.addEventListener('click', useHint);

// Tombol untuk hasil permainan
document.getElementById('continue-game').addEventListener('click', () => {
    resultPage.classList.add('hidden');
    currentScoreDisplay.textContent = currentScore; // Perbarui tampilan skor
    // completedQuestions tidak direset agar soal yang sudah berhasil dijawab tidak muncul lagi
    startGame();
});
document.getElementById('back-to-category').addEventListener('click', () => {
    resultPage.classList.add('hidden');
    categoryPage.classList.remove('hidden');
    currentScoreDisplay.textContent = currentScore; // Perbarui tampilan skor
    // Hanya reset daftar soal yang telah diselesaikan, tidak reset level progress
    completedQuestions = {}; // Reset daftar soal yang telah diselesaikan saat kembali ke pemilihan kategori
});

// Tombol untuk reset skor
document.getElementById('reset-score').addEventListener('click', () => {
    currentScore = 0;
    currentScoreDisplay.textContent = currentScore;
    gameScore.textContent = currentScore;
    totalScore.textContent = currentScore;
});

// Tombol aksi permainan
document.getElementById('new-game').addEventListener('click', () => {
    gamePage.classList.add('hidden');
    currentScoreDisplay.textContent = currentScore; // Perbarui tampilan skor
    // Reset daftar soal yang telah diselesaikan saat memulai permainan baru dengan level yang sama
    if (!completedQuestions[currentCategory]) completedQuestions[currentCategory] = {};
    if (!completedQuestions[currentCategory][currentLevel]) completedQuestions[currentCategory][currentLevel] = [];
    startGame();
});
document.getElementById('new-category').addEventListener('click', () => {
    gamePage.classList.add('hidden');
    categoryPage.classList.remove('hidden');
    currentScoreDisplay.textContent = currentScore; // Perbarui tampilan skor
    // Hanya reset daftar soal yang telah diselesaikan, tidak reset level progress
    completedQuestions = {}; // Reset daftar soal yang telah diselesaikan saat kembali ke pemilihan kategori
});

// Fungsi untuk memulai permainan
function startGame() {
    if (!currentCategory || !currentLevel) {
        alert('Silakan pilih kategori dan level terlebih dahulu!');
        return;
    }

    // Reset status permainan
    resetGame();

    // Inisialisasi tracking soal yang telah selesai jika belum ada
    if (!completedQuestions[currentCategory]) {
        completedQuestions[currentCategory] = {};
    }
    if (!completedQuestions[currentCategory][currentLevel]) {
        completedQuestions[currentCategory][currentLevel] = [];
    }

    // Pilih kata acak dari kategori dan level yang dipilih
    const categoryWords = categories[currentCategory];
    //console.log(`Memilih dari kategori: ${currentCategory}, level: ${currentLevel}`);
    //console.log(`Jumlah total soal dalam kategori: ${categoryWords.length}`);

    // Filter soal berdasarkan level yang dipilih
    const filteredWords = categoryWords.filter(wordObj => !wordObj.level || wordObj.level === currentLevel);
    //console.log(`Jumlah soal untuk level ${currentLevel}: ${filteredWords.length}`);

    // Filter untuk menghindari soal yang sudah diselesaikan
    const availableWords = filteredWords.filter(wordObj => !completedQuestions[currentCategory][currentLevel].includes(wordObj.word));
    //console.log(`Jumlah soal tersedia (belum diselesaikan): ${availableWords.length}`);

    // Periksa apakah sudah menyelesaikan semua soal di level ini
    if (availableWords.length === 0 && filteredWords.length > 0) {
        // Cek apakah semua soal dalam level ini telah dikerjakan
        if (completedQuestions[currentCategory][currentLevel].length >= 20) {
            // Otomatis naik ke level berikutnya di kategori yang sama
            const levelOrder = ['mudah', 'sedang', 'sulit'];
            const currentLevelIndex = levelOrder.indexOf(currentLevel);

            if (currentLevelIndex < levelOrder.length - 1) {
                // Naik ke level berikutnya
                const nextLevel = levelOrder[currentLevelIndex + 1];

                // Pastikan level berikutnya memiliki soal
                const nextLevelWords = categoryWords.filter(wordObj => !wordObj.level || wordObj.level === nextLevel);

                if (nextLevelWords.length > 0) {
                    currentLevel = nextLevel;

                    if (!levelAccessed[currentCategory]) {
                        levelAccessed[currentCategory] = {};
                    }
                    levelAccessed[currentCategory][currentLevel] = true;

                    // Tambahkan tracking untuk level baru jika belum ada
                    if (!completedQuestions[currentCategory][currentLevel]) {
                        completedQuestions[currentCategory][currentLevel] = [];
                    }

                    // Pilih soal dari level baru
                    const newAvailableWords = nextLevelWords.filter(wordObj => !completedQuestions[currentCategory][currentLevel].includes(wordObj.word));

                    if (newAvailableWords.length > 0) {
                        currentWord = newAvailableWords[Math.floor(Math.random() * newAvailableWords.length)];
                        completedQuestions[currentCategory][currentLevel].push(currentWord.word);
                    } else {
                        // Jika tidak ada soal tersedia di level berikutnya, pilih dari level ini
                        // Ini hanya akan terjadi dalam keadaan ekstrem
                        currentWord = nextLevelWords[Math.floor(Math.random() * nextLevelWords.length)];
                        completedQuestions[currentCategory][currentLevel].push(currentWord.word);
                    }

                    // Perbarui tampilan level
                    document.querySelectorAll('.btn-level').forEach(btn => btn.classList.remove('selected'));
                    document.querySelector(`[data-level="${currentLevel}"]`).classList.add('selected');

                    // Aktifkan tombol mulai permainan
                    checkStartGameEnabled();
                } else {
                    // Jika tidak ada level berikutnya yang valid, kembali ke pemilihan kategori
                    alert(`Anda telah menyelesaikan semua soal di kategori ${capitalizeFirstLetter(currentCategory)}! Silakan pilih kategori atau level yang berbeda.`);
                    gamePage.classList.add('hidden');
                    categoryPage.classList.remove('hidden');
                    currentScoreDisplay.textContent = currentScore; // Perbarui tampilan skor
                    return;
                }
            } else {
                // Jika sudah mencapai level tertinggi, kembali ke pemilihan kategori
                // Tandai bahwa kategori ini telah selesai semua levelnya
                if (!levelAccessed[currentCategory]) {
                    levelAccessed[currentCategory] = {};
                }
                levelAccessed[currentCategory]['mudah'] = true;
                levelAccessed[currentCategory]['sedang'] = true;
                levelAccessed[currentCategory]['sulit'] = true;
                alert(`Anda telah menyelesaikan semua soal di kategori ${capitalizeFirstLetter(currentCategory)}! Silakan pilih kategori yang berbeda.`);
                gamePage.classList.add('hidden');
                categoryPage.classList.remove('hidden');
                currentScoreDisplay.textContent = currentScore; // Perbarui tampilan skor
                return;
            }
        } else {
            // Ini kondisi yang seharusnya tidak terjadi secara logis
            // Karena jika availableWords.length === 0 maka completedQuestions[currentCategory][currentLevel].length 
            // seharusnya sama dengan filteredWords.length (semua soal sudah dikerjakan)
            // Tapi untuk antisipasi, kita pilih soal dari soal yang belum diselesaikan
            alert("Terjadi kesalahan logika: tidak ditemukan soal tersedia meskipun belum mencapai 20 soal yang diselesaikan.");
            gamePage.classList.add('hidden');
            categoryPage.classList.remove('hidden');
            currentScoreDisplay.textContent = currentScore; // Perbarui tampilan skor
            return;
        }
    } else if (filteredWords.length === 0) {
        // Jika tidak ada soal untuk level ini, ambil semua soal
        //console.log("Tidak ada soal untuk level ini, mengambil dari semua soal");
        currentWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
        completedQuestions[currentCategory][currentLevel].push(currentWord.word);
    } else {
        // Ambil soal yang belum diselesaikan
        currentWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        completedQuestions[currentCategory][currentLevel].push(currentWord.word);
        //console.log(`Soal yang dipilih: ${currentWord.word}`);
    }

    // Tampilkan informasi permainan
    currentCategoryDisplay.textContent = capitalizeFirstLetter(currentCategory);
    currentLevelDisplay.textContent = capitalizeFirstLetter(currentLevel);
    gameScore.textContent = currentScore;

    // Set nilai maksimal dan pengurangan hint
    const levelConfig = levels[currentLevel];
    const maxScore = currentWord.maxScore * levelConfig.hintPenaltyMultiplier;
    maxScoreDisplay.textContent = maxScore;
    hintPenaltyDisplay.textContent = currentWord.hintPenalty[currentLevel];

    // Inisialisasi array hints dan revealed letters
    currentHints = [...currentWord.hints];
    revealedLetters = Array(currentWord.word.length).fill('_');
    incorrectGuesses = 0;

    //console.log(`Soal baru: ${currentWord.word}, revealedLetters:`, revealedLetters);

    // Tampilkan word display dan error display
    renderWordDisplay();
    renderErrorDisplay();

    // Reset hint
    usedHints = [];
    currentHint.textContent = "Klik tombol 'Gunakan Hint' untuk mendapatkan petunjuk";
    hintsUsed.textContent = '0';
    availableHintsDisplay.textContent = currentHints.length;

    // Sembunyikan halaman lain dan tampilkan halaman permainan
    categoryPage.classList.add('hidden');
    resultPage.classList.add('hidden');
    gamePage.classList.remove('hidden');

    // Fokus ke input tebakan
    guessInput.focus();
    guessInput.value = '';

    // Set status permainan aktif
    gameActive = true;

    //console.log(`Permainan dimulai dengan soal: ${currentWord.word}, level: ${currentLevel}`);
}

// Fungsi untuk mereset status permainan
function resetGame() {
    currentWord = null;
    revealedLetters = [];
    incorrectGuesses = 0;
    currentHint.textContent = "Klik tombol 'Gunakan Hint' untuk mendapatkan petunjuk";
    hintsUsed.textContent = '0';
    usedHints = [];
    guessInput.value = '';
    guessInput.disabled = false;
    submitGuessBtn.disabled = false;
    useHintBtn.disabled = false;
    gameActive = false;
}

// Fungsi untuk merender tampilan kata
function renderWordDisplay() {
    wordDisplay.innerHTML = '';
    for (let i = 0; i < currentWord.word.length; i++) {
        const letterBox = document.createElement('div');
        letterBox.className = 'letter-box';
        if (revealedLetters[i] !== '_') {
            letterBox.textContent = revealedLetters[i];
            letterBox.classList.add('revealed');
        } else {
            letterBox.textContent = revealedLetters[i];
        }
        wordDisplay.appendChild(letterBox);
    }
}

// Fungsi untuk merender tampilan kesalahan
function renderErrorDisplay() {
    errorDisplay.innerHTML = '';
    const maxErrors = levels[currentLevel].maxErrors(currentWord.word);

    for (let i = 0; i < maxErrors; i++) {
        const errorMark = document.createElement('div');
        errorMark.className = 'error-mark';
        if (i < incorrectGuesses) {
            errorMark.textContent = 'X';
        } else {
            errorMark.textContent = '';
        }
        errorDisplay.appendChild(errorMark);
    }
}

// Fungsi untuk membuat tebakan
function makeGuess() {
    if (!gameActive) return;

    const guess = guessInput.value.trim().toUpperCase();
    guessInput.value = '';

    if (!guess || guess.length !== 1 || !/^[A-Z\-]$/.test(guess)) {
        alert('Silakan masukkan satu huruf!');
        return;
    }

    // Cek apakah huruf sudah direveal
    if (revealedLetters.includes(guess)) {
        alert('Huruf ini sudah ditebak sebelumnya!');
        return;
    }

    // Cek apakah huruf ada dalam kata
    const correct = currentWord.word.includes(guess);

    if (correct) {
        // Jika benar, reveal semua posisi huruf tersebut
        for (let i = 0; i < currentWord.word.length; i++) {
            if (currentWord.word[i] === guess) {
                revealedLetters[i] = guess;
            }
        }
        renderWordDisplay();

        // Cek apakah sudah selesai
        if (!revealedLetters.includes('_')) {
            endGame(true);
            return;
        }
    } else {
        // Jika salah, tambah kesalahan
        incorrectGuesses++;
        renderErrorDisplay();

        // Cek apakah sudah melebihi batas kesalahan
        const maxErrors = levels[currentLevel].maxErrors(currentWord.word);
        if (incorrectGuesses >= maxErrors) {
            endGame(false);
            return;
        }
    }
}

// Fungsi untuk menggunakan hint
function useHint() {
    if (!gameActive || usedHints.length >= currentHints.length) return;

    // Pilih hint secara acak dari yang belum digunakan
    const remainingHints = currentHints.filter(hint => !usedHints.includes(hint));
    if (remainingHints.length > 0) {
        const penaltyPerHint = currentWord.hintPenalty[currentLevel];

        // Periksa apakah skor cukup untuk menggunakan hint
        if (currentScore < penaltyPerHint) {
            alert(`Skor Anda (${currentScore}) tidak cukup untuk menggunakan hint. Harga hint: ${penaltyPerHint} poin.`);
            return;
        }

        const randomHint = remainingHints[Math.floor(Math.random() * remainingHints.length)];
        currentHint.textContent = randomHint;
        usedHints.push(randomHint);
        hintsUsed.textContent = usedHints.length;
        availableHintsDisplay.textContent = currentHints.length - usedHints.length;

        // Kurangi poin secara langsung saat hint digunakan
        currentScore = currentScore - penaltyPerHint;

        // Pastikan skor tidak turun di bawah 0
        if (currentScore < 0) {
            currentScore = 0;
        }

        gameScore.textContent = currentScore;
        totalScore.textContent = currentScore;
    }
}

// Fungsi untuk mengakhiri permainan
function endGame(success) {
    gameActive = false;
    guessInput.disabled = true;
    submitGuessBtn.disabled = true;
    useHintBtn.disabled = true;

    if (success) {
        // Karena hint sudah mengurangi skor secara langsung, 
        // saat jawaban benar, tambahkan max skor kata ke total skor
        currentScore = currentScore + currentWord.maxScore;

        resultTitle.textContent = 'Selamat!';
        resultMessage.textContent = `Anda berhasil menebak kata: ${currentWord.word}`;
        resultPoints.textContent = currentWord.maxScore;
        totalScore.textContent = currentScore;
    } else {
        // Permainan kalah - tidak ada penambahan skor karena jawaban salah
        resultTitle.textContent = 'Permainan Berakhir';
        resultMessage.textContent = `Anda gagal menebak kata: ${currentWord.word}`;
        resultPoints.textContent = '0';
        totalScore.textContent = currentScore;
    }

    // Tampilkan halaman hasil
    gamePage.classList.add('hidden');
    resultPage.classList.remove('hidden');
}

// Fungsi untuk mengakhiri permainan
function endGame(success) {
    gameActive = false;
    guessInput.disabled = true;
    submitGuessBtn.disabled = true;
    useHintBtn.disabled = true;

    if (success) {
        // Karena hint sudah mengurangi skor secara langsung,
        // saat jawaban benar, tambahkan max skor kata ke total skor
        currentScore = currentScore + currentWord.maxScore;

        resultTitle.textContent = 'Selamat!';
        resultMessage.textContent = `Anda berhasil menebak kata: ${currentWord.word}`;
        resultPoints.textContent = currentWord.maxScore;
        totalScore.textContent = currentScore;

    } else {
        // Permainan kalah - tidak ada penambahan skor karena jawaban salah
        resultTitle.textContent = 'Permainan Berakhir';
        resultMessage.textContent = `Anda gagal menebak kata: ${currentWord.word}`;
        resultPoints.textContent = '0';
        totalScore.textContent = currentScore;
    }

    // Tambahkan soal ke daftar soal yang telah selesai dikerjakan - hanya jika berhasil
    if (success && currentCategory && currentLevel && currentWord && currentWord.word) {
        if (!completedQuestions[currentCategory]) {
            completedQuestions[currentCategory] = {};
        }
        if (!completedQuestions[currentCategory][currentLevel]) {
            completedQuestions[currentCategory][currentLevel] = [];
        }
        if (!completedQuestions[currentCategory][currentLevel].includes(currentWord.word)) {
            completedQuestions[currentCategory][currentLevel].push(currentWord.word);
        }
    }

    // Tampilkan halaman hasil
    gamePage.classList.add('hidden');
    resultPage.classList.remove('hidden');
}

// Fungsi untuk mengubah huruf pertama menjadi kapital
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Inisialisasi permainan
async function initGame() {
    // Muat data soal dari JSON
    await loadQuestions();

    // Tampilkan halaman pendaftaran awal
    registrationPage.classList.remove('hidden');
    categoryPage.classList.add('hidden');
    gamePage.classList.add('hidden');
    resultPage.classList.add('hidden');

    // Reset semua pilihan
    document.querySelectorAll('.btn-category').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.btn-level').forEach(btn => btn.classList.remove('selected'));
    startGameBtn.disabled = true;
}

// Panggil inisialisasi
initGame();