(() => {
    "use strict";

    const componentCatalog = [
        '<path d="M60 8v164"/>',
        '<path d="M60 9 42 29h36L60 9Zm0 0v20"/>',
        '<path d="m42 151 18 20 18-20"/>',
        '<circle cx="60" cy="75" r="29"/>',
        '<path d="M31 75h58"/>',
        '<path d="M60 46v58"/>',
        '<path d="M45 25h30M60 13v24"/>',
        '<path d="m44 132 16 18 16-18m-32 0 32 32m0-32-32 32"/>',
        '<path d="M44 149h32M60 149v21"/>',
        '<path d="M60 11c-20 18-20 38 0 56s20 37 0 55-20 32 0 48"/>',
        '<path d="M43 46c-15 15-15 43 0 58M77 46c15 15 15 43 0 58"/>',
        '<path d="m43 47 34 56m0-56-34 56"/>',
        '<path d="M60 9 43 28h34L60 9Zm0 0v163"/>',
        '<path d="M60 8v164m0-23-18-20m18 20 18-20"/>',
        '<path d="M60 9v162m0-162L44 28m16-19 16 19M44 151l16 20 16-20"/>',
        '<path d="M60 9v39m0 56v67M60 9 43 28h34L60 9Zm0 162-18-20m18 20 18-20"/>',
        '<path d="M60 9 42 29h18"/>',
        '<path d="M60 9 78 29H60"/>'
    ];
    const motifCatalog = [
        { name: "Poros berpanah", components: [0, 1, 2] },
        { name: "Lingkaran bersumbu", components: [0, 3, 4, 5] },
        { name: "Poros bercabang", components: [0, 6, 7] },
        { name: "Lekuk memanjang", components: [9] },
        { name: "Lingkaran berlengkung", components: [0, 3, 10] },
        { name: "Lingkaran bersilang", components: [0, 3, 11] },
        { name: "Panah berporos", components: [12, 8] },
        { name: "Poros berekor", components: [13] },
        { name: "Panah silang", components: [14] },
        { name: "Poros berujung", components: [15] },
        { name: "Lingkaran dan ekor", components: [0, 3, 4, 8] },
        { name: "Cincin bercabang", components: [0, 3, 5, 7] },
        { name: "Gelombang berpanah", components: [9, 1, 2] },
        { name: "Lengkung berekor", components: [0, 10, 8] },
        { name: "Gelombang bercabang", components: [9, 6, 2] },
        { name: "Cincin berekor silang", components: [0, 3, 8, 11] },
        { name: "Gelombang miring kiri", components: [16, 9] },
        { name: "Poros miring kanan", components: [17, 13] },
        { name: "Poros bersilang bawah", components: [0, 6, 8] },
        { name: "Lingkaran bercabang", components: [0, 3, 4, 7] },
        { name: "Cincin berlekuk silang", components: [0, 3, 10, 8] },
        { name: "Cincin bersumbu berpanah", components: [0, 3, 11, 2] },
        { name: "Poros berpalang ganda", components: [0, 4, 7] },
        { name: "Gelombang bercincin", components: [9, 3, 6] },
        { name: "Gelombang berpalang", components: [0, 10, 4, 8] },
        { name: "Cincin berporos berekor", components: [0, 3, 5, 2] },
        { name: "Poros bersilang bertingkat", components: [0, 6, 7, 8] },
        { name: "Poros berlekuk silang", components: [0, 9, 7] },
        { name: "Cincin bercabang berekor", components: [0, 3, 6, 2] },
        { name: "Poros berpalang bercabang", components: [0, 4, 6, 8] },
        { name: "Gelombang silang bercincin", components: [9, 3, 11, 2] },
        { name: "Cincin berlekuk bercabang", components: [0, 3, 10, 7] },
        { name: "Poros berlekuk berpalang", components: [0, 9, 4, 8] },
        { name: "Cincin silang berekor", components: [0, 3, 11, 8] },
        { name: "Gelombang bercabang berpalang", components: [9, 6, 4, 2] },
        { name: "Cincin berporos bercabang", components: [0, 3, 6, 8] },
        { name: "Lekuk bersumbu silang", components: [9, 4, 7] },
        { name: "Cincin berlekuk bersumbu", components: [0, 3, 10, 5] },
        { name: "Poros berpanah bercabang", components: [12, 7] },
        { name: "Cincin bersilang berekor bawah", components: [0, 11, 8] },
        { name: "Lekuk bercabang berujung", components: [9, 4, 2] },
        { name: "Cincin bercabang berporos", components: [0, 3, 6, 2] },
        { name: "Lekuk berpalang bercabang", components: [9, 5, 7] }
    ];
    const OBJECT_COUNT = 4;
    const objectMotifPools = [
        [0, 1, 2, 3, 18, 19, 27, 28, 35, 36],
        [4, 5, 10, 16, 20, 21, 29, 30, 37, 38],
        [6, 7, 8, 17, 22, 23, 31, 32, 39, 40],
        [13, 14, 15, 24, 25, 26, 33, 34, 41, 42]
    ];
    const elements = {
        level: document.getElementById("level-value"),
        score: document.getElementById("score-value"),
        bestScore: document.getElementById("best-score-value"),
        streak: document.getElementById("streak-value"),
        timer: document.getElementById("timer-value"),
        levelTitle: document.getElementById("level-title"),
        puzzleCard: document.querySelector(".puzzle-card"),
        targetFrame: document.getElementById("target-frame"),
        buildFrame: document.getElementById("build-frame"),
        buildPanel: document.querySelector(".build-panel"),
        completionBanner: document.getElementById("completion-banner"),
        partCounter: document.getElementById("part-counter"),
        activeObject: document.getElementById("active-object-name"),
        partNavigation: document.getElementById("part-navigation"),
        message: document.getElementById("game-message"),
        hint: document.getElementById("hint-button"),
        reset: document.getElementById("reset-button"),
        tutorial: document.getElementById("tutorial-overlay"),
        tutorialStart: document.getElementById("tutorial-start")
    };
    const state = {
        level: 1,
        score: 0,
        bestScore: 0,
        streak: 0,
        selectedLayer: 0,
        target: [],
        build: [],
        hinted: false,
        hintedIndex: null,
        elapsedSeconds: 0,
        timerStartedAt: null,
        timerId: null,
        hasStarted: false,
        locked: false,
        levelComplete: false,
        buildVersion: 0,
        storageAvailable: true
    };

    function randomIndex(max) {
        return Math.floor(Math.random() * max);
    }

    function getChoiceLimit(level = state.level) {
        return Math.min(10, 4 + Math.floor((level - 1) / 2));
    }

    function getObjectOptions(objectIndex) {
        return objectMotifPools[objectIndex].slice(0, getChoiceLimit());
    }

    function setMessage(text, type = "") {
        elements.message.textContent = text;
        elements.message.className = `game-message${type ? ` is-${type}` : ""}`;
    }

    function makeSymbolMarkup(configuration, highlightedIndex = null, selectedIndex = null) {
        const layerOrder = configuration.map((_, index) => index);
        if (selectedIndex !== null) {
            layerOrder.splice(selectedIndex, 1);
            layerOrder.push(selectedIndex);
        }
        const overlays = layerOrder.map((index) => {
            const motifId = configuration[index];
            const motif = motifCatalog[motifId];
            const components = motif.components.map((componentId) => {
                const hintClass = index === highlightedIndex ? " is-hinted" : "";
                return `<g class="symbol-component${hintClass}" data-component="${componentId}">${componentCatalog[componentId]}</g>`;
            }).join("");
            const selectedClass = index === selectedIndex ? " is-selected" : "";
            return `<g class="symbol-overlay${selectedClass}" data-object="${index + 1}">${components}</g>`;
        }).join("");
        return `<svg viewBox="0 0 120 180" role="img" aria-label="Lambang dari ${configuration.length} bentuk tinggi yang bertumpuk">${overlays}</svg>`;
    }

    function makeChoiceMarkup(motifId) {
        const components = motifCatalog[motifId].components.map((componentId) => {
            return `<g class="symbol-component">${componentCatalog[componentId]}</g>`;
        }).join("");
        return `<svg viewBox="0 0 120 180" aria-hidden="true">${components}</svg>`;
    }

    function getSymbolSignature(configuration) {
        return configuration
            .flatMap((motifId) => motifCatalog[motifId].components)
            .sort((first, second) => first - second)
            .join(",");
    }

    async function getVisualSignature(configuration) {
        const components = configuration.flatMap((motifId) => {
            return motifCatalog[motifId].components.map((componentId) => componentCatalog[componentId]);
        }).join("");
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="360" viewBox="0 0 120 180"><g fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${components}</g></svg>`;
        const imageUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
        const image = new Image();
        const imageLoaded = new Promise((resolve, reject) => {
            image.onload = resolve;
            image.onerror = () => reject(new Error("SVG lambang tidak dapat dirender untuk pemeriksaan."));
        });
        image.src = imageUrl;
        try {
            await imageLoaded;
            const canvas = document.createElement("canvas");
            canvas.width = 240;
            canvas.height = 360;
            const context = canvas.getContext("2d", { willReadFrequently: true });
            if (!context) throw new Error("Canvas tidak tersedia untuk memeriksa lambang.");
            context.drawImage(image, 0, 0);
            const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
            const mask = new Uint8Array(canvas.width * canvas.height);
            for (let pixel = 0; pixel < mask.length; pixel += 1) {
                mask[pixel] = pixels[pixel * 4 + 3] > 0 ? 1 : 0;
            }
            return mask;
        } finally {
            URL.revokeObjectURL(imageUrl);
        }
    }

    async function areSymbolsVisuallyEqual(first, second) {
        const [firstPixels, secondPixels] = await Promise.all([
            getVisualSignature(first),
            getVisualSignature(second)
        ]);
        return firstPixels.every((value, index) => value === secondPixels[index]);
    }

    async function checkCompletion() {
        if (state.locked) return;
        const buildVersion = state.buildVersion;
        const target = [...state.target];
        const build = [...state.build];
        const matches = getSymbolSignature(build) === getSymbolSignature(target)
            || await areSymbolsVisuallyEqual(build, target);
        if (matches && !state.locked && state.buildVersion === buildVersion) completeLevel();
    }

    function requestCompletionCheck() {
        const buildVersion = state.buildVersion;
        checkCompletion().catch((error) => {
            if (state.locked || state.buildVersion !== buildVersion) return;
            console.error("Tidak dapat memeriksa kecocokan visual lambang.", error);
            setMessage("Lambang belum dapat diperiksa. Coba muat ulang game.", "warning");
        });
    }

    function updateSymbols() {
        elements.targetFrame.innerHTML = makeSymbolMarkup(state.target, state.hintedIndex);
        elements.buildFrame.innerHTML = makeSymbolMarkup(state.build, null, state.selectedLayer);
        elements.buildPanel.classList.toggle("is-complete", state.locked && state.levelComplete);
    }

    function renderLayers() {
        elements.partNavigation.replaceChildren();
        state.build.forEach((motifId, index) => {
            const button = document.createElement("button");
            const card = document.createElement("div");
            card.className = `layer-control${index === state.selectedLayer ? " is-selected" : ""}`;
            button.className = "layer-tab";
            button.type = "button";
            button.setAttribute("aria-pressed", String(index === state.selectedLayer));
            button.setAttribute("aria-label", `Pilih objek ${index + 1}`);
            button.innerHTML = `${makeChoiceMarkup(motifId)}<span>Objek ${String(index + 1).padStart(2, "0")}</span>`;
            button.addEventListener("click", () => selectLayer(index));
            const rotateControls = document.createElement("div");
            rotateControls.className = "layer-rotate-controls";
            [
                { action: "change-up", direction: -1, icon: "↑", label: "Pilihan sebelumnya" },
                { action: "change-down", direction: 1, icon: "↓", label: "Pilihan berikutnya" }
            ].forEach(({ action, direction, icon, label }) => {
                const control = document.createElement("button");
                control.type = "button";
                control.className = "layer-rotate-button";
                control.dataset.action = action;
                control.setAttribute("aria-label", `Objek ${index + 1}: ${label}`);
                control.textContent = icon;
                control.addEventListener("click", () => {
                    if (state.locked) return;
                    state.selectedLayer = index;
                    changeMotif(direction);
                });
                rotateControls.append(control);
            });
            card.append(button, rotateControls);
            elements.partNavigation.append(card);
        });
        elements.partCounter.textContent = `OBJEK ${String(state.selectedLayer + 1).padStart(2, "0")} / ${String(OBJECT_COUNT).padStart(2, "0")}`;
        const options = getObjectOptions(state.selectedLayer);
        const choiceNumber = options.indexOf(state.build[state.selectedLayer]) + 1;
        elements.activeObject.textContent = `Objek ${String(state.selectedLayer + 1).padStart(2, "0")} · pilihan ${choiceNumber} / ${options.length}`;
    }

    function renderStats() {
        elements.level.textContent = String(state.level).padStart(2, "0");
        elements.score.textContent = state.score.toLocaleString("id-ID");
        elements.bestScore.textContent = state.bestScore.toLocaleString("id-ID");
        elements.streak.innerHTML = `${state.streak} <span>beruntun</span>`;
    }

    function selectLayer(index) {
        if (state.locked) return;
        state.selectedLayer = (index + state.build.length) % state.build.length;
        renderLayers();
        updateSymbols();
        requestCompletionCheck();
    }

    function setMotif(motifId) {
        if (state.locked) return;
        if (!getObjectOptions(state.selectedLayer).includes(motifId)) return;
        state.build[state.selectedLayer] = motifId;
        state.buildVersion += 1;
        renderLayers();
        updateSymbols();
        requestCompletionCheck();
    }

    function changeMotif(direction) {
        if (state.locked) return;
        const options = getObjectOptions(state.selectedLayer);
        const currentIndex = options.indexOf(state.build[state.selectedLayer]);
        const nextIndex = (currentIndex + direction + options.length) % options.length;
        setMotif(options[nextIndex]);
    }

    function renderTimer() {
        const hours = Math.floor(state.elapsedSeconds / 3600);
        const minutes = Math.floor((state.elapsedSeconds % 3600) / 60);
        const seconds = state.elapsedSeconds % 60;
        elements.timer.textContent = hours > 0
            ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
            : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    function stopTimer() {
        if (state.timerStartedAt !== null) {
            state.elapsedSeconds = Math.floor((Date.now() - state.timerStartedAt) / 1000);
            state.timerStartedAt = null;
            renderTimer();
        }
        if (state.timerId !== null) {
            window.clearInterval(state.timerId);
            state.timerId = null;
        }
    }

    function startTimer() {
        stopTimer();
        state.elapsedSeconds = 0;
        state.timerStartedAt = Date.now();
        renderTimer();
        state.timerId = window.setInterval(() => {
            state.elapsedSeconds = Math.floor((Date.now() - state.timerStartedAt) / 1000);
            renderTimer();
        }, 1000);
    }

    function loadBestScore() {
        try {
            const storedScore = Number(window.localStorage.getItem("glyph-forge-best") || 0);
            state.bestScore = Number.isFinite(storedScore) && storedScore > 0 ? storedScore : 0;
        } catch (error) {
            state.storageAvailable = false;
            console.warn("Rekor skor tidak dapat dibaca dari browser ini.", error);
        }
    }

    function saveBestScore() {
        if (!state.storageAvailable || state.score <= state.bestScore) return;
        state.bestScore = state.score;
        try {
            window.localStorage.setItem("glyph-forge-best", String(state.bestScore));
        } catch (error) {
            state.storageAvailable = false;
            console.warn("Skor terbaik tidak dapat disimpan di browser ini.", error);
        }
    }

    function completeLevel() {
        state.locked = true;
        state.levelComplete = true;
        elements.puzzleCard.classList.add("is-won");
        elements.reset.disabled = false;
        elements.hint.disabled = true;
        stopTimer();
        state.streak += 1;
        const bonus = Math.max(0, 120 - state.elapsedSeconds) * 2 + state.streak * 10;
        const points = Math.max(50, 120 + bonus - (state.hinted ? 60 : 0));
        state.score += points;
        saveBestScore();
        renderStats();
        updateSymbols();
        const nextLevel = state.level + 1;
        elements.reset.textContent = `Lanjut ke level ${String(nextLevel).padStart(2, "0")} →`;
        const resultMessage = `Level ${String(state.level).padStart(2, "0")} selesai! Tersusun dalam ${formatDuration(state.elapsedSeconds)} · +${points} poin.`;
        elements.completionBanner.textContent = `${resultMessage} Tekan “Lanjut ke level ${String(nextLevel).padStart(2, "0")}” di bawah jika siap.`;
        elements.completionBanner.hidden = false;
        setMessage(resultMessage, "success");
    }

    function setupLevel() {
        state.locked = false;
        state.levelComplete = false;
        elements.puzzleCard.classList.remove("is-won");
        state.buildVersion += 1;
        elements.reset.disabled = false;
        state.selectedLayer = 0;
        state.hinted = false;
        state.hintedIndex = null;
        elements.reset.textContent = "Mulai ulang ↻";

        const availableObjectOneOptions = getObjectOptions(0).filter((motifId) => motifId !== 0);
        state.target = [
            availableObjectOneOptions[randomIndex(availableObjectOneOptions.length)],
            16,
            17,
            getObjectOptions(3)[randomIndex(getObjectOptions(3).length)]
        ];
        state.build = state.target.map((targetMotifId, objectIndex) => {
            const decoys = getObjectOptions(objectIndex).filter((motifId) => motifId !== targetMotifId);
            return decoys[randomIndex(decoys.length)];
        });

        elements.levelTitle.textContent = state.level < 11 ? `Ruang Simbol ${String(state.level).padStart(2, "0")}` : "Ruang Simbol ∞";
        elements.completionBanner.hidden = true;
        elements.hint.disabled = false;
        renderStats();
        renderLayers();
        updateSymbols();
        setMessage(state.level === 1 ? "Pilih satu dari empat objek. Putar bentuk tingginya sampai tumpukan sama dengan target." : "Lambang baru siap. Cocokkan bentuk-bentuk yang bertumpuk.", "");
        if (state.hasStarted) {
            startTimer();
            requestCompletionCheck();
        } else {
            state.elapsedSeconds = 0;
            renderTimer();
        }
    }

    function formatDuration(totalSeconds) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return hours > 0
            ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
            : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    function useHint() {
        if (!state.hasStarted || state.locked || state.hinted) return;
        state.hinted = true;
        const mismatchedIndexes = state.target.flatMap((motifId, index) => state.build[index] !== motifId ? [index] : []);
        state.hintedIndex = mismatchedIndexes[randomIndex(mismatchedIndexes.length)];
        state.score = Math.max(0, state.score - 60);
        renderStats();
        updateSymbols();
        elements.hint.disabled = true;
        setMessage(`Bentuk objek ${state.hintedIndex + 1} disorot pada target. Putar objek itu untuk menemukan susunan garis yang cocok.`, "");
    }

    function restartLevel() {
        if (state.levelComplete) {
            state.level += 1;
            setupLevel();
            return;
        }
        if (!state.locked) state.streak = 0;
        setupLevel();
    }

    function handleAction(action) {
        if (!state.hasStarted) return;
        if (action === "previous") selectLayer(state.selectedLayer - 1);
        if (action === "next") selectLayer(state.selectedLayer + 1);
        if (action === "change-up") changeMotif(-1);
        if (action === "change-down") changeMotif(1);
    }

    function handleKeydown(event) {
        if (!state.hasStarted || event.altKey || event.ctrlKey || event.metaKey) return;
        const keyActions = {
            ArrowLeft: "previous",
            ArrowRight: "next",
            ArrowUp: "change-up",
            ArrowDown: "change-down",
            a: "previous",
            d: "next",
            w: "change-up",
            s: "change-down"
        };
        const action = keyActions[event.key];
        if (action) {
            event.preventDefault();
            handleAction(action);
        } else if (event.key === "h" || event.key === "H") {
            useHint();
        }
    }

    document.querySelectorAll("[data-action]").forEach((button) => {
        button.addEventListener("click", () => handleAction(button.dataset.action));
    });
    document.addEventListener("keydown", handleKeydown);
    elements.hint.addEventListener("click", useHint);
    elements.reset.addEventListener("click", restartLevel);
    elements.tutorialStart.addEventListener("click", () => {
        if (state.hasStarted) return;
        state.hasStarted = true;
        elements.tutorial.hidden = true;
        elements.puzzleCard.closest(".app-shell").inert = false;
        document.body.classList.remove("tutorial-open");
        startTimer();
        elements.partNavigation.querySelector(".layer-tab")?.focus();
    });

    loadBestScore();
    setupLevel();
    elements.tutorialStart.focus();
})();
