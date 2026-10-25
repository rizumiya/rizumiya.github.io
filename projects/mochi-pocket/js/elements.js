/**
 * Mochi Pocket — js/elements.js
 * Referensi Elemen DOM & Variabel Runtime Utama
 */

// 1. Panggung & Karakter
const petStageEl = document.getElementById("pet-stage");
const petInteractive = document.getElementById("pet-interactive");
const formElements = {
  orb: document.getElementById("form-orb"),
  cat: document.getElementById("form-cat"),
  hamster: document.getElementById("form-hamster"),
  dog: document.getElementById("form-dog"),
  hedgehog: document.getElementById("form-hedgehog"),
  duck: document.getElementById("form-duck"),
  sheep: document.getElementById("form-sheep"),
  cow: document.getElementById("form-cow"),
  rabbit: document.getElementById("form-rabbit"),
  pig: document.getElementById("form-pig"),
  penguin: document.getElementById("form-penguin"),
  live2d: document.getElementById("form-live2d")
};

// 2. Wujud Puni Mochi (Hexo Aurora) & Balon Percakapan
const auroraDiaEl = document.getElementById("Aurora-Dia");
const auroraEyesEl = document.getElementById("Aurora-Dia--eyes");
const auroraLeftEye = document.getElementById("Aurora-Dia--left-eye");
const auroraRightEye = document.getElementById("Aurora-Dia--right-eye");
const tipsWrapperEl = document.getElementById("Aurora-Dia--tips-wrapper");
const tipsTextEl = document.getElementById("Aurora-Dia--tips");

// 3. Status HUD Atas & Bezel
const petNameDisplay = document.getElementById("pet-name-display");
const petLevelBadge = document.getElementById("pet-level-badge");
const petSceneBadge = document.getElementById("pet-scene-badge");
const sceneBgLayer = document.getElementById("scene-bg-layer");
const bezelFormName = document.getElementById("bezel-form-name");
const statusDot = document.getElementById("status-dot");
const statusLabel = document.getElementById("status-label");
const transformBurst = document.getElementById("transform-burst");
const particlesContainer = document.getElementById("particles-container");

// 4. Indikator Gauges (Makan, Hati, Energi, EXP)
const gaugeHunger = document.getElementById("gauge-hunger");
const gaugeHappy = document.getElementById("gauge-happy");
const gaugeEnergy = document.getElementById("gauge-energy");
const gaugeExp = document.getElementById("gauge-exp");

// 5. Live2D Elemen
const live2dStageBox = document.getElementById("live2d-stage-box");
const live2dOverlay = document.getElementById("live2d-status-overlay");
const live2dStatusText = document.getElementById("live2d-status-text");
const live2dModelSelect = document.getElementById("live2d-model-select");
const live2dCustomUrl = document.getElementById("live2d-custom-url");

// 6. Modal-Modal (Panduan, Karakter, Pengaturan)
const guideModal = document.getElementById("guide-modal");
const characterModal = document.getElementById("character-modal");
const characterForm = document.getElementById("character-form");
const settingsModal = document.getElementById("settings-modal");
const settingsForm = document.getElementById("settings-form");
const petNameInput = document.getElementById("pet-name-input");

// 7. HUD Mini-Game & Laci Game
const minigameHud = document.getElementById("minigame-hud");
const minigameLayer = document.getElementById("minigame-layer");
const minigameIconEl = document.getElementById("minigame-icon");
const minigameScoreEl = document.getElementById("minigame-score");
const minigameTimerEl = document.getElementById("minigame-timer");

const gameSelectorDrawer = document.getElementById("game-selector-drawer");
const gameCardsTrack = document.getElementById("game-cards-track");
const gameCardButtons = Array.from(document.querySelectorAll(".game-card-option"));
const btnCloseGameSelector = document.getElementById("btn-close-game-selector");
const btnGameScrollLeft = document.getElementById("game-scroll-left");
const btnGameScrollRight = document.getElementById("game-scroll-right");

// 8. Runtime State Karakter & Interaksi
let currentState = "idle"; // "idle" | "surprised" | "happy" | "angry" | "sleep"
let stateTimeout = null;
let messageTimeout = null;
let petStopTimeout = null;
let orbEyesResetTimer = null;
let animalEyesResetTimer = null;

let clickTimestamps = [];
let isPointerDown = false;
let lastDragX = null;
let rubDistanceAccumulated = 0;
let lastHeartTime = 0;
let lastPetRewardTime = 0;

let loadedLive2dUrl = "";
let talkIndex = 0;
let activeSceneKey = "default";
let renderedSceneKey = "";
let smoothedSwayX = 0;

// Pelacakan Posisi Kursor & Parallax
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

// Runtime Mini-Game
let isGameSelectorOpen = false;
let selectedGameIndex = 0;
let isPlayingMinigame = false;
let activeMinigameType = "coin"; // "coin" | "catcher" | "header"
let minigameScore = 0;
let minigameSeconds = 15;
let minigameSpawnTimer = null;
let minigameCountdownTimer = null;
let minigameRafId = null;
let lastFrameTime = 0;

let playerX = 50; // Persentase horizontal karakter minigame (16% s/d 84%)
let moveLeftHeld = false;
let moveRightHeld = false;
let isDraggingStagePlayer = false;
let catcherItems = [];
let soccerBall = null;
