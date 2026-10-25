/**
 * Mochi Pocket — js/interactions.js
 * Gestur Mouse (Hover, Elus Kiri-Kanan, Klik 3x Marah), Partikel & Pelacakan Kursor (Parallax Mata/Kepala)
 */

function switchState(newState, duration = null) {
  if (stateTimeout) {
    clearTimeout(stateTimeout);
    stateTimeout = null;
  }

  currentState = newState;
  const hasHeadbutt = petInteractive.classList.contains("headbutt-pop");
  petInteractive.className = `pet-interactive state-${newState}${hasHeadbutt ? " headbutt-pop" : ""}`;

  const ledInfo = STATE_LED[newState] || STATE_LED.idle;
  if (statusDot) {
    statusDot.className = `status-led ${ledInfo.led}`;
  }
  if (statusLabel) {
    statusLabel.textContent = ledInfo.text;
  }

  if (typeof duration === "number" && duration > 0) {
    stateTimeout = setTimeout(() => {
      switchState(pet.isSleeping ? "sleep" : "idle");
    }, duration);
  }
}

function applyPetSway(rawDeltaX) {
  if (pet.activeForm === "orb") {
    const swayX = Math.max(-10, Math.min(10, rawDeltaX * 0.65));
    const tiltDeg = swayX * 0.45;
    auroraDiaEl.style.transform = `translateX(${swayX}px) rotate(${tiltDeg}deg) scale(1.06, 0.94)`;
  } else if (pet.activeForm === "live2d") {
    const swayX = Math.max(-9, Math.min(9, rawDeltaX * 0.55));
    const tiltDeg = swayX * 0.3;
    live2dStageBox.style.transform = `translateX(${swayX}px) rotate(${tiltDeg}deg) scale(1.03, 0.97)`;
  } else {
    const clampedTarget = Math.max(-6.5, Math.min(6.5, rawDeltaX * 0.42));
    smoothedSwayX += (clampedTarget - smoothedSwayX) * 0.38;
    const tiltDeg = smoothedSwayX * 0.32;
    const activeFormEl = formElements[pet.activeForm];
    const squashEl = activeFormEl && activeFormEl.querySelector(".chara-squash");
    if (squashEl) {
      squashEl.style.transform = `translateX(${smoothedSwayX.toFixed(2)}px) rotate(${tiltDeg.toFixed(2)}deg) scale(1.03, 0.97)`;
    }
  }
}

function spawnParticleAt(x, y, symbols = ["💕", "💖", "✨", "💗"]) {
  if (!particlesContainer) return;
  const stageRect = particlesContainer.getBoundingClientRect();
  const item = document.createElement("div");
  item.className = "heart-particle";
  item.textContent = randomPick(symbols);

  const relX = x - stageRect.left + (Math.random() * 36 - 18);
  const relY = y - stageRect.top - 12;

  item.style.left = `${relX}px`;
  item.style.top = `${relY}px`;

  particlesContainer.appendChild(item);
  setTimeout(() => item.remove(), 1000);
}

function spawnBurstParticles(symbols = ["✨", "💕", "⭐"]) {
  if (!petInteractive) return;
  const rect = petInteractive.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  for (let i = 0; i < 6; i += 1) {
    setTimeout(() => {
      spawnParticleAt(
        centerX + (Math.random() * 80 - 40),
        centerY + (Math.random() * 50 - 25),
        symbols
      );
    }, i * 65);
  }
}

function resetCursorTrackingTarget() {
  targetX = 0;
  targetY = 0;
  clearTimeout(animalEyesResetTimer);
  clearTimeout(orbEyesResetTimer);
  if (auroraEyesEl) {
    auroraEyesEl.style.transform = "translate3d(0, 0, 0)";
  }
}

function handlePointerMove(clientX, clientY) {
  if (pet.isSleeping) return;

  if (pet.activeForm === "orb" && auroraEyesEl) {
    clearTimeout(orbEyesResetTimer);
    const rect = auroraEyesEl.getBoundingClientRect();
    const ox = -(rect.left - clientX) / 80;
    const oy = -(rect.top - clientY) / 72;
    const clampedOx = Math.max(-15, Math.min(15, ox));
    const clampedOy = Math.max(-18, Math.min(12, oy));
    auroraEyesEl.style.transform = `translate3d(${clampedOx.toFixed(2)}px, ${clampedOy.toFixed(2)}px, 0)`;

    orbEyesResetTimer = setTimeout(() => {
      auroraEyesEl.style.transform = "translate3d(0, 0, 0)";
    }, 2200);
    return;
  }

  const activeFormEl = formElements[pet.activeForm];
  if (!activeFormEl) return;

  const stageRect = petStageEl.getBoundingClientRect();
  const petCenterX = stageRect.left + stageRect.width / 2;
  const petCenterY = stageRect.top + stageRect.height * 0.46;

  const dx = clientX - petCenterX;
  const dy = clientY - petCenterY;
  const dist = Math.hypot(dx, dy);

  const factor = Math.min(dist / 220, 1);
  const angle = Math.atan2(dy, dx);

  targetX = Math.cos(angle) * factor;
  targetY = Math.sin(angle) * factor;

  clearTimeout(animalEyesResetTimer);
  animalEyesResetTimer = setTimeout(() => {
    targetX = 0;
    targetY = 0;
  }, 2200);
}

function animateCursorTracking() {
  if (!pet.isSleeping && pet.activeForm !== "orb" && pet.activeForm !== "live2d") {
    currentX += (targetX - currentX) * 0.16;
    currentY += (targetY - currentY) * 0.16;
    if (Math.abs(currentX) < 0.005 && targetX === 0) currentX = 0;
    if (Math.abs(currentY) < 0.005 && targetY === 0) currentY = 0;

    const activeFormEl = formElements[pet.activeForm];
    if (activeFormEl) {
      const eyes = activeFormEl.querySelectorAll(".tracking-eye");
      const irises = activeFormEl.querySelectorAll(".tracking-iris");
      const head = activeFormEl.querySelector(".parallax-head");
      const muzzle = activeFormEl.querySelector(".parallax-muzzle");
      const blush = activeFormEl.querySelector(".parallax-blush");
      const accent = activeFormEl.querySelector(".parallax-accent");
      const whiskers = activeFormEl.querySelector(".parallax-whiskers");

      const eyeScale = 10;
      eyes.forEach((eye) => {
        eye.style.transform = `translate3d(${currentX * eyeScale}px, ${currentY * (eyeScale * 0.85)}px, 0)`;
      });

      irises.forEach((iris) => {
        iris.style.transform = `translate3d(${currentX * 4}px, ${currentY * 4}px, 0)`;
      });

      if (head) {
        head.style.transform = `translate3d(calc(-50% + ${currentX * 4.5}px), ${currentY * 3}px, 0) rotate(${currentX * 4}deg)`;
      }
      if (muzzle) {
        muzzle.style.transform = `translate3d(calc(-50% + ${currentX * 5.5}px), ${currentY * 4}px, 0)`;
      }
      if (blush) {
        blush.style.transform = `translate3d(${currentX * 4.5}px, ${currentY * 3}px, 0)`;
      }
      if (accent) {
        if (pet.activeForm === "dog") {
          accent.style.transform = `translate3d(${currentX * 4}px, ${currentY * 2.5}px, 0)`;
        } else {
          accent.style.transform = `translate3d(calc(-50% + ${currentX * 4}px), ${currentY * 2.5}px, 0)`;
        }
      }
      if (whiskers) {
        whiskers.style.transform = `translate3d(calc(-50% + ${currentX * 4}px), ${currentY * 3}px, 0)`;
      }
    }
  }

  requestAnimationFrame(animateCursorTracking);
}

function startPetting(clientX) {
  if (pet.isSleeping || pet.isDead || isPlayingMinigame) return;
  isPointerDown = true;
  lastDragX = clientX;
  rubDistanceAccumulated = 0;
}

function handlePettingMove(clientX, clientY) {
  if (!isPointerDown || pet.isSleeping || pet.isDead || isPlayingMinigame) return;

  if (lastDragX !== null) {
    const deltaX = clientX - lastDragX;
    rubDistanceAccumulated += Math.abs(deltaX);
    applyPetSway(deltaX);

    const now = Date.now();
    if (rubDistanceAccumulated >= 45 && now - lastHeartTime > 190) {
      lastHeartTime = now;
      spawnParticleAt(clientX, clientY, ["💕", "💖", "✨", "💗"]);

      if (currentState !== "happy" && currentState !== "angry") {
        switchState("happy");
      }
    }

    if (rubDistanceAccumulated >= 130 && now - lastPetRewardTime > 2500) {
      lastPetRewardTime = now;
      rubDistanceAccumulated = 0;
      const wasTantrum = Boolean(pet.isUnhappyTantrum);
      addExpAndStats({ exp: 5, happiness: 5 });

      if (wasTantrum && !pet.isUnhappyTantrum) {
        say(`Wah, elusanmu bikin ${petNameTag()} baikan lagi! Aku nggak ngambek lagi deh~ 🥰💖`, 4200);
      } else {
        const happyLines = [
          `Purrr~ Hangat dan nyaman sekali elusanmu! Makasih ya~ 💕`,
          `Hihi geli tapi ${petNameTag()} suka banget dielus begitu! ✨`,
          `Elusan terbaik di dunia! ${petNameTag()} sayang banget sama kamu~ 💖`
        ];
        say(randomPick(happyLines), 3500);
      }
    }
  }
  lastDragX = clientX;
}

function endPetting() {
  if (!isPointerDown) return;
  isPointerDown = false;
  lastDragX = null;
  rubDistanceAccumulated = 0;

  if (pet.activeForm === "orb" && auroraDiaEl) {
    auroraDiaEl.style.transform = "none";
  } else if (pet.activeForm === "live2d" && live2dStageBox) {
    live2dStageBox.style.transform = "none";
  } else {
    const activeFormEl = formElements[pet.activeForm];
    const squashEl = activeFormEl && activeFormEl.querySelector(".chara-squash");
    if (squashEl) {
      squashEl.style.transform = "none";
    }
  }

  if (currentState === "happy") {
    setTimeout(() => {
      if (currentState === "happy") {
        switchState(pet.isSleeping ? "sleep" : "idle");
      }
    }, 1100);
  }
}

// Event Listeners Interaksi
petInteractive.addEventListener("mouseenter", () => {
  if (pet.isDead || pet.isSleeping || isPlayingMinigame) return;

  // Efek terbangun kaget dari micro-sleep karena kelelahan
  if (typeof isDrowsyNodding !== "undefined" && isDrowsyNodding) {
    isDrowsyNodding = false;
    petInteractive.classList.remove("drowsy-sleep");
    switchState("surprised", 1300);
    spawnBurstParticles(["💤", "💦", "✨"]);
    say(
      `Aah! ${petNameTag()} ketiduran... soalnya eri merasa lelah (Energi tinggal ${pet.energy}%)... Tidurkan aku lewat <span>D-Pad &#x25BC;&#xFE0E;</span> yuk~ 🥱💤`,
      4800
    );
    return;
  }

  if (pet.isUnhappyTantrum) {
    switchState("angry", 1200);
    say(`Hmph! ${petNameTag()} lagi ngambek berat nih! Bahagiaku 0%! Elus aku atau ajak main dong sampai minimal 10%... 😤💢`, 3500);
    return;
  }

  if (currentState === "idle" && !isPointerDown) {
    const duration = activeSceneKey === "haunted_house" ? 920 : 820;
    switchState("surprised", duration);
    if (activeSceneKey === "haunted_house") {
      spawnBurstParticles(["😱", "👻", "💦"]);
    }
    const lines = getSceneHoverLines(activeSceneKey);
    say(randomPick(lines), 4500);
  }
});

petInteractive.addEventListener("click", () => {
  if (pet.isDead || pet.isSleeping || isPlayingMinigame) return;

  // Efek terbangun kaget dari micro-sleep saat di-tap/klik di HP
  if (typeof isDrowsyNodding !== "undefined" && isDrowsyNodding) {
    isDrowsyNodding = false;
    petInteractive.classList.remove("drowsy-sleep");
    switchState("surprised", 1300);
    spawnBurstParticles(["💤", "💦", "✨"]);
    say(
      `Aah! ${petNameTag()} ketiduran... soalnya eri merasa lelah (Energi tinggal ${pet.energy}%)... Tidurkan aku lewat <span>D-Pad &#x25BC;&#xFE0E;</span> yuk~ 🥱💤`,
      4800
    );
    return;
  }

  if (pet.isUnhappyTantrum) {
    switchState("angry", 2200);
    say(`Hmph! ${petNameTag()} lagi ngambek berat nih! Bahagiaku 0%! Elus aku atau ajak main dong sampai minimal 10%... 😤💢`, 3500);
    return;
  }

  const now = Date.now();
  clickTimestamps.push(now);
  clickTimestamps = clickTimestamps.filter((ts) => now - ts <= 1200);

  if (clickTimestamps.length >= 3) {
    clickTimestamps = [];
    switchState("angry", 2600);
    spawnBurstParticles(["💢", "⚡", "😤"]);

    const angryLines = [
      `Aduh jangan diklik cepat-cepat begitu! Pusing tahu! 😤💢`,
      `Eeeh pelan-pelan dong! ${petNameTag()} lagi tidak mau dijahili! 😾`,
      `Iih iseng banget sih! Nanti ${petNameTag()} ngambek beneran nih! 💢`
    ];
    say(randomPick(angryLines), 3500);
    addExpAndStats({ happiness: -3 });
    return;
  }

  if (currentState === "idle") {
    switchState("happy", 1100);
    spawnParticleAt(
      petInteractive.getBoundingClientRect().left + 75,
      petInteractive.getBoundingClientRect().top + 30,
      ["✨", "💖"]
    );
  }
});

petInteractive.addEventListener("mousedown", (e) => {
  if (e.button === 0) startPetting(e.clientX);
});

window.addEventListener("mousemove", (e) => {
  handlePointerMove(e.clientX, e.clientY);
  handlePettingMove(e.clientX, e.clientY);
});

window.addEventListener("mouseup", () => endPetting());

petInteractive.addEventListener(
  "touchstart",
  (e) => {
    if (e.touches.length === 1) startPetting(e.touches[0].clientX);
  },
  { passive: true }
);

window.addEventListener(
  "touchmove",
  (e) => {
    if (e.touches.length === 1) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      handlePettingMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  },
  { passive: false }
);

window.addEventListener("touchend", () => {
  resetCursorTrackingTarget();
  endPetting();
});

window.addEventListener("touchcancel", () => {
  resetCursorTrackingTarget();
  endPetting();
});

document.addEventListener("mouseleave", () => {
  resetCursorTrackingTarget();
  endPetting();
});

document.documentElement.addEventListener("mouseleave", () => {
  resetCursorTrackingTarget();
  endPetting();
});
