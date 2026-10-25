/**
 * Mochi Pocket — js/minigames.js
 * Drawer Pilihan Mini-Game & Engine Mini-Game (Koin Hoki, Tangkap Makan, Sundul Bola)
 */

function highlightGameCard(index, scrollIntoView = true) {
  selectedGameIndex = (index + GAME_MODES.length) % GAME_MODES.length;
  gameCardButtons.forEach((btn, idx) => {
    const isActive = idx === selectedGameIndex;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
    if (isActive && scrollIntoView && gameCardsTrack) {
      const trackRect = gameCardsTrack.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      const offset =
        btnRect.left - trackRect.left - trackRect.width / 2 + btnRect.width / 2;
      gameCardsTrack.scrollBy({ left: offset, behavior: "smooth" });
    }
  });
}

function openGameSelector() {
  if (isPlayingMinigame) {
    stopMinigame(false);
    return;
  }
  if (pet.isSleeping) {
    say(`Bangunkan ${petNameTag()} dulu dengan <span>D-Pad &#x25BC;&#xFE0E;</span> sebelum bermain ya~ 💤`);
    return;
  }
  if (pet.energy < 15) {
    say(`Energi ${petNameTag()} tinggal sedikit (${pet.energy}%)... Tidur atau makan dulu yuk! ⚡`);
    return;
  }

  isGameSelectorOpen = true;
  if (gameSelectorDrawer) gameSelectorDrawer.hidden = false;
  if (petStageEl) petStageEl.classList.add("game-selector-open");
  highlightGameCard(selectedGameIndex, true);
}

function closeGameSelector() {
  isGameSelectorOpen = false;
  if (gameSelectorDrawer) gameSelectorDrawer.hidden = true;
  if (petStageEl) petStageEl.classList.remove("game-selector-open");
}

function toggleGameSelector() {
  if (isPlayingMinigame) {
    stopMinigame(false);
    return;
  }
  if (isGameSelectorOpen) {
    closeGameSelector();
  } else {
    openGameSelector();
  }
}

// Drag-to-scroll horizontal dengan mouse pada daftar kartu game
if (gameCardsTrack) {
  let isTrackDown = false;
  let startTrackX = 0;
  let scrollLeftStart = 0;

  gameCardsTrack.addEventListener("mousedown", (e) => {
    isTrackDown = true;
    startTrackX = e.pageX - gameCardsTrack.offsetLeft;
    scrollLeftStart = gameCardsTrack.scrollLeft;
  });
  window.addEventListener("mouseup", () => {
    isTrackDown = false;
  });
  gameCardsTrack.addEventListener("mousemove", (e) => {
    if (!isTrackDown) return;
    e.preventDefault();
    const x = e.pageX - gameCardsTrack.offsetLeft;
    const walk = (x - startTrackX) * 1.4;
    gameCardsTrack.scrollLeft = scrollLeftStart - walk;
  });
}

if (btnCloseGameSelector) {
  btnCloseGameSelector.addEventListener("click", (e) => {
    e.stopPropagation();
    closeGameSelector();
  });
}

if (btnGameScrollLeft) {
  btnGameScrollLeft.addEventListener("click", (e) => {
    e.stopPropagation();
    highlightGameCard(selectedGameIndex - 1, true);
  });
}

if (btnGameScrollRight) {
  btnGameScrollRight.addEventListener("click", (e) => {
    e.stopPropagation();
    highlightGameCard(selectedGameIndex + 1, true);
  });
}

gameCardButtons.forEach((btn, idx) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    selectedGameIndex = idx;
    const mode = btn.dataset.game || "coin";
    startMinigame(mode);
  });
});

function setPlayerX(nextPct) {
  playerX = Math.max(16, Math.min(84, nextPct));
  if (petStageEl) {
    petStageEl.style.setProperty("--player-x", `${playerX.toFixed(2)}%`);
  }
}

function updatePlayerXFromClientX(clientX) {
  if (!petStageEl) return;
  const rect = petStageEl.getBoundingClientRect();
  if (rect.width <= 0) return;
  const pct = ((clientX - rect.left) / rect.width) * 100;
  setPlayerX(pct);
}

// Drag/sentuh langsung di layar konsol untuk menggerakkan karakter saat Game 2 & 3
if (petStageEl) {
  petStageEl.addEventListener("mousedown", (e) => {
    if (!isPlayingMinigame || activeMinigameType === "coin") return;
    if (e.target.closest("button")) return;
    isDraggingStagePlayer = true;
    updatePlayerXFromClientX(e.clientX);
  });

  petStageEl.addEventListener("mousemove", (e) => {
    if (!isPlayingMinigame || activeMinigameType === "coin") return;
    if (e.target.closest("button")) return;
    updatePlayerXFromClientX(e.clientX);
  });

  petStageEl.addEventListener(
    "touchstart",
    (e) => {
      if (!isPlayingMinigame || activeMinigameType === "coin") return;
      if (e.target.closest("button")) return;
      if (e.touches.length > 0) {
        isDraggingStagePlayer = true;
        updatePlayerXFromClientX(e.touches[0].clientX);
      }
    },
    { passive: true }
  );
}

window.addEventListener("mouseup", () => {
  isDraggingStagePlayer = false;
  moveLeftHeld = false;
  moveRightHeld = false;
});

window.addEventListener("touchend", () => {
  isDraggingStagePlayer = false;
  moveLeftHeld = false;
  moveRightHeld = false;
});

function createOnScreenMoveButtons() {
  const leftBtn = document.createElement("button");
  leftBtn.type = "button";
  leftBtn.className = "minigame-move-btn left";
  leftBtn.innerHTML = "&#x25C0;&#xFE0E;";
  leftBtn.title = "Geser Kiri";

  const rightBtn = document.createElement("button");
  rightBtn.type = "button";
  rightBtn.className = "minigame-move-btn right";
  rightBtn.innerHTML = "&#x25B6;&#xFE0E;";
  rightBtn.title = "Geser Kanan";

  const bindHold = (btn, dir) => {
    const start = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (dir < 0) {
        moveLeftHeld = true;
        setPlayerX(playerX - 6);
      } else {
        moveRightHeld = true;
        setPlayerX(playerX + 6);
      }
    };
    const end = () => {
      if (dir < 0) moveLeftHeld = false;
      else moveRightHeld = false;
    };
    btn.addEventListener("pointerdown", start);
    btn.addEventListener("pointerup", end);
    btn.addEventListener("pointercancel", end);
    btn.addEventListener("pointerleave", end);
  };

  bindHold(leftBtn, -1);
  bindHold(rightBtn, 1);

  minigameLayer.appendChild(leftBtn);
  minigameLayer.appendChild(rightBtn);
}

function startMinigame(gameType = "coin") {
  if (isPlayingMinigame) {
    stopMinigame(false);
    return;
  }
  if (pet.isSleeping) {
    say(`Bangunkan ${petNameTag()} dulu dengan <span>D-Pad &#x25BC;&#xFE0E;</span> sebelum bermain ya~ 💤`);
    return;
  }
  if (pet.energy < 15) {
    say(`Energi ${petNameTag()} tinggal sedikit (${pet.energy}%)... Tidur atau makan dulu yuk! ⚡`);
    return;
  }

  closeGameSelector();

  activeMinigameType = GAME_MODES.includes(gameType) ? gameType : "coin";
  const meta = GAME_META[activeMinigameType];

  isPlayingMinigame = true;
  minigameScore = 0;
  minigameSeconds = meta.duration;
  if (minigameIconEl) minigameIconEl.textContent = meta.icon;
  minigameScoreEl.textContent = "0";
  minigameTimerEl.textContent = String(minigameSeconds);

  if (messageTimeout) {
    clearTimeout(messageTimeout);
    messageTimeout = null;
  }
  tipsWrapperEl.classList.remove("active");

  if (petStageEl) {
    petStageEl.classList.add("minigame-active");
    petStageEl.classList.toggle("minigame-player-mode", activeMinigameType !== "coin");
  }

  setPlayerX(50);
  moveLeftHeld = false;
  moveRightHeld = false;
  catcherItems = [];
  soccerBall = null;

  minigameHud.hidden = false;
  minigameLayer.hidden = false;
  minigameLayer.innerHTML = "";

  if (activeMinigameType === "coin") {
    spawnFallingCoin();
    minigameSpawnTimer = setInterval(spawnFallingCoin, 680);
  } else if (activeMinigameType === "catcher") {
    createOnScreenMoveButtons();
    spawnCatcherItem();
    minigameSpawnTimer = setInterval(spawnCatcherItem, 620);
    lastFrameTime = performance.now();
    minigameRafId = requestAnimationFrame(updateMinigameFrame);
  } else if (activeMinigameType === "header") {
    createOnScreenMoveButtons();
    initSoccerBall();
    lastFrameTime = performance.now();
    minigameRafId = requestAnimationFrame(updateMinigameFrame);
  }

  minigameCountdownTimer = setInterval(() => {
    minigameSeconds -= 1;
    minigameTimerEl.textContent = String(minigameSeconds);
    if (minigameSeconds <= 0) {
      stopMinigame(true);
    }
  }, 1000);
}

// --- GAME 1: KOIN HOKI (Ketuk Koin & Permata Jatuh) ---
function spawnFallingCoin() {
  if (!isPlayingMinigame || activeMinigameType !== "coin") return;
  const coin = document.createElement("button");
  coin.type = "button";
  coin.className = "falling-star";
  const symbol = randomPick(["🪙", "🪙", "🌟", "💎"]);
  coin.textContent = symbol;
  coin.style.left = `${8 + Math.random() * 76}%`;

  const fallSeconds = (3.4 + Math.random() * 0.7).toFixed(2);
  coin.style.setProperty("--fall-duration", `${fallSeconds}s`);

  const catchCoin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (coin.dataset.caught === "1") return;
    coin.dataset.caught = "1";

    const bonus = symbol === "💎" ? 2 : 1;
    minigameScore += bonus;
    minigameScoreEl.textContent = String(minigameScore);

    const rect = coin.getBoundingClientRect();
    const cx = e.clientX || rect.left + rect.width / 2;
    const cy = e.clientY || rect.top + rect.height / 2;
    spawnParticleAt(cx, cy, ["🪙", "✨", "⭐"]);

    coin.classList.add("star-caught");
    setTimeout(() => {
      if (coin.parentNode) coin.remove();
    }, 200);
  };

  coin.addEventListener("pointerdown", catchCoin);
  coin.addEventListener("click", catchCoin);

  minigameLayer.appendChild(coin);
  setTimeout(() => {
    if (coin.parentNode && coin.dataset.caught !== "1") {
      coin.remove();
    }
  }, 4400);
}

// --- GAME 2: TANGKAP MAKANAN & HINDARI RACUN ---
function spawnCatcherItem() {
  if (!isPlayingMinigame || activeMinigameType !== "catcher") return;
  const isPoison = Math.random() < 0.28;
  const el = document.createElement("div");
  el.className = `catcher-item ${isPoison ? "poison-item" : "food-item"}`;
  el.textContent = isPoison
    ? randomPick(["☠️", "🧪", "🍄", "💣"])
    : randomPick(["🍙", "🍓", "🍰", "🍩", "🌻", "🍣"]);

  const xPct = 14 + Math.random() * 72;
  const yPx = -24;
  const speedY = 2.0 + Math.random() * 1.15;

  el.style.left = `${xPct}%`;
  el.style.top = `${yPx}px`;
  minigameLayer.appendChild(el);

  catcherItems.push({ el, xPct, yPx, speedY, isPoison });
}

// --- GAME 3: SUNDUL BOLA (Keepie-Uppie Physics) ---
function initSoccerBall() {
  const el = document.createElement("div");
  el.className = "soccer-ball-el";
  el.textContent = "⚽";
  minigameLayer.appendChild(el);

  soccerBall = {
    el,
    xPct: 50,
    yPx: 58,
    vxPct: (Math.random() < 0.5 ? -1 : 1) * 0.48,
    vyPx: 1.6,
    gravity: 0.145,
    angle: 0,
    cooldown: 0
  };
}

function triggerHeadbuttBounce() {
  petInteractive.classList.remove("headbutt-pop");
  void petInteractive.offsetWidth;
  petInteractive.classList.add("headbutt-pop");
}

function updateMinigameFrame(now) {
  if (!isPlayingMinigame) return;
  const dt = Math.min(32, Math.max(8, now - (lastFrameTime || now)));
  lastFrameTime = now;
  const dtScale = dt / 16.67;

  // Perbarui posisi horizontal pet jika tombol kiri/kanan ditahan
  if (moveLeftHeld) {
    setPlayerX(playerX - 1.75 * dtScale);
  }
  if (moveRightHeld) {
    setPlayerX(playerX + 1.75 * dtScale);
  }

  const stageH = petStageEl ? petStageEl.clientHeight : 300;
  const petRect = petInteractive.getBoundingClientRect();
  const petCenterX = petRect.left + petRect.width / 2;
  const petTopY = petRect.top + 18;

  if (activeMinigameType === "catcher") {
    const catchTopY = pet.activeForm === "orb" ? stageH - 76 : stageH - 106;
    const catchBottomY = stageH - 14;

    for (let i = catcherItems.length - 1; i >= 0; i -= 1) {
      const item = catcherItems[i];
      item.yPx += item.speedY * dtScale;
      item.el.style.top = `${item.yPx.toFixed(1)}px`;

      const hitVertical = item.yPx >= catchTopY && item.yPx <= catchBottomY;
      const hitHorizontal = Math.abs(item.xPct - playerX) <= 13.8;

      if (hitVertical && hitHorizontal) {
        if (item.isPoison) {
          minigameScore = Math.max(0, minigameScore - 2);
          minigameScoreEl.textContent = String(minigameScore);
          switchState("angry", 680);
          spawnParticleAt(petCenterX, petTopY, ["💥", "☠️", "💢"]);
        } else {
          minigameScore += 1;
          minigameScoreEl.textContent = String(minigameScore);
          switchState("happy", 380);
          spawnParticleAt(petCenterX, petTopY, ["🍙", "💖", "✨"]);
        }
        item.el.remove();
        catcherItems.splice(i, 1);
      } else if (item.yPx > stageH + 28) {
        item.el.remove();
        catcherItems.splice(i, 1);
      }
    }
  } else if (activeMinigameType === "header" && soccerBall) {
    if (soccerBall.cooldown > 0) {
      soccerBall.cooldown -= dtScale;
    }

    soccerBall.vyPx += soccerBall.gravity * dtScale;
    soccerBall.xPct += soccerBall.vxPct * dtScale;
    soccerBall.yPx += soccerBall.vyPx * dtScale;
    soccerBall.angle += soccerBall.vxPct * 9 * dtScale;

    // Pantulan dinding kiri & kanan
    if (soccerBall.xPct <= 8) {
      soccerBall.xPct = 8;
      soccerBall.vxPct = Math.abs(soccerBall.vxPct);
    } else if (soccerBall.xPct >= 92) {
      soccerBall.xPct = 92;
      soccerBall.vxPct = -Math.abs(soccerBall.vxPct);
    }

    // Pantulan atap layar
    if (soccerBall.yPx <= 42) {
      soccerBall.yPx = 42;
      soccerBall.vyPx = Math.abs(soccerBall.vyPx) * 0.85;
    }

    // Deteksi sundulan kepala karakter
    const headHitY = pet.activeForm === "orb" ? stageH - 72 : stageH - 102;
    const dxPct = soccerBall.xPct - playerX;

    if (
      soccerBall.cooldown <= 0 &&
      soccerBall.vyPx > 0 &&
      soccerBall.yPx >= headHitY - 14 &&
      soccerBall.yPx <= headHitY + 28 &&
      Math.abs(dxPct) <= 15.8
    ) {
      soccerBall.cooldown = 10;
      soccerBall.yPx = headHitY - 15;
      const speedBoost = Math.min(1.5, minigameScore * 0.05);
      soccerBall.vyPx = -(5.35 + speedBoost);

      const normOffset = dxPct / 15.8;
      soccerBall.vxPct =
        normOffset * 1.15 + (Math.random() * 0.24 - 0.12);
      soccerBall.vxPct = Math.max(-1.45, Math.min(1.45, soccerBall.vxPct));

      minigameScore += 1;
      minigameScoreEl.textContent = String(minigameScore);

      triggerHeadbuttBounce();
      switchState("happy", 360);
      spawnParticleAt(petCenterX, petTopY, ["⚽", "✨", "⭐"]);
    } else if (soccerBall.yPx > stageH - 8) {
      // Bola jatuh ke tanah: karakter cemberut sebentar lalu bola di-serve ulang dari atas
      switchState("angry", 560);
      spawnParticleAt(petCenterX, petTopY, ["💢", "💨"]);
      soccerBall.xPct = 24 + Math.random() * 52;
      soccerBall.yPx = 56;
      soccerBall.vyPx = 1.35;
      soccerBall.vxPct = (Math.random() < 0.5 ? -1 : 1) * 0.45;
      soccerBall.cooldown = 12;
    }

    soccerBall.el.style.left = `${soccerBall.xPct.toFixed(2)}%`;
    soccerBall.el.style.top = `${soccerBall.yPx.toFixed(1)}px`;
    soccerBall.el.style.transform = `translate(-50%, -50%) rotate(${soccerBall.angle.toFixed(1)}deg)`;
  }

  minigameRafId = requestAnimationFrame(updateMinigameFrame);
}

function stopMinigame(completed = true) {
  isPlayingMinigame = false;
  moveLeftHeld = false;
  moveRightHeld = false;
  isDraggingStagePlayer = false;

  clearInterval(minigameSpawnTimer);
  clearInterval(minigameCountdownTimer);
  if (minigameRafId) {
    cancelAnimationFrame(minigameRafId);
    minigameRafId = null;
  }

  catcherItems = [];
  soccerBall = null;

  if (petStageEl) {
    petStageEl.classList.remove("minigame-active", "minigame-player-mode");
    petStageEl.style.removeProperty("--player-x");
  }
  petInteractive.classList.remove("headbutt-pop");

  minigameHud.hidden = true;
  minigameLayer.hidden = true;
  minigameLayer.innerHTML = "";

  const meta = GAME_META[activeMinigameType] || GAME_META.coin;

  if (completed) {
    const expGain = Math.max(12, minigameScore * 6);
    const happyGain = Math.min(25, 6 + minigameScore * 2);

    // Saat diajak main: Energi berkurang sedikit lebih cepat dari Kenyang (-8 vs -5),
    // dan Kenyang (-5) berkurang lebih cepat dari pada saat didiamkan (-1.0).
    const foodCaughtBonus = activeMinigameType === "catcher" ? Math.min(6, minigameScore * 1.2) : 0;
    const netHungerCost = -5 + foodCaughtBonus;

    addExpAndStats({
      exp: expGain,
      happiness: happyGain,
      energy: -8,
      hunger: netHungerCost
    });
    switchState("happy", 1400);
    say(
      `🎉 Skor <span>${meta.title}: ${minigameScore} ${meta.unit}</span>! ${petNameTag()} dapat <span>+${expGain} EXP</span> &amp; <span>+${happyGain}% Bahagia</span>!`
    );
  } else {
    // Jika game dihentikan di tengah jalan, tetap ada konsumsi energi dan kenyang proporsional
    addExpAndStats({ energy: -4, hunger: -2.5 });
    switchState(pet.isSleeping ? "sleep" : "idle");
    say(`Permainan dihentikan. Kapan-kapan main lagi bareng ${petNameTag()} ya~`);
  }
}
