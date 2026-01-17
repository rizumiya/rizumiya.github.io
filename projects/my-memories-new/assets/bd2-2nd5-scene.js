
    // 캐릭터 선택 총 갯수
    const characterMax = 12;
    // 클리어한 게임 캐릭터
    let clearedGame = [];

    let isBGM = true; //배경음악 재생 여부
    let nowScene;

    // Audio setup: background + UI sounds
    const audioFiles = {
        bg: 'assets/audio/bg-music.mp3',
        focus: 'assets/audio/btn-focus.mp3',
        press: 'assets/audio/btn-press.mp3'
    };
    let audioUnlocked = false; // become true after first user gesture
    const bgAudio = new Audio(audioFiles.bg);
    bgAudio.loop = true;
    bgAudio.preload = 'auto';
    //bgAudio.volume = 0.2;
    bgAudio.volume = 0.1;

    const focusAudio = new Audio(audioFiles.focus);
    focusAudio.preload = 'auto';
    focusAudio.volume = 0.8;
    focusAudio.loop = false;

    const pressAudio = new Audio(audioFiles.press);
    pressAudio.preload = 'auto';
    pressAudio.volume = 0.9;
    pressAudio.loop = false;

    function unlockAudioOnce() {
        if (audioUnlocked) return;
        audioUnlocked = true;
        // audio is unlocked for UI sounds; background music will be started explicitly when Play is chosen
    }

    function playBGMusic() {
        if (!isBGM) return;
        if (!audioUnlocked) return;
        bgAudio.play().catch(() => {});
    }

    // Control background music explicitly
    // setBGMusic(true) -> start playing (only when audioUnlocked)
    // setBGMusic(false) -> pause and reset to start
    function setBGMusic(enabled) {
        try {
            if (enabled) {
                if (!isBGM) return;
                if (!audioUnlocked) return;
                bgAudio.play().catch(() => {});
                // RIZKI
            // } else {
            //     try { bgAudio.pause(); } catch (e) {}
            //     try { bgAudio.currentTime = 0; } catch (e) {}
            }
        } catch (e) {
            // swallow errors to avoid breaking UI
        }
    }

    /*
    // Toggle background music on/off based on current playback state
    function toggleBGMusic() {
        try {
            const playing = !!(bgAudio && !bgAudio.paused && !bgAudio.ended);
            setBGMusic(!playing);
        } catch (e) {}
    }

    // Helper to check if bg music is currently playing
    function isBGMusicPlaying() {
        try {
            return !!(bgAudio && !bgAudio.paused && !bgAudio.ended);
        } catch (e) { return false; }
    }
    */

    function playFocusSound() {
        if (!audioUnlocked) return;
        try {
            focusAudio.currentTime = 0;
            focusAudio.play().catch(() => {});
        } catch (e) {}
    }

    function playPressSound() {
        if (!audioUnlocked) return;
        try {
            pressAudio.currentTime = 0;
            pressAudio.play().catch(() => {});
        } catch (e) {}
    }

    // gameKeymap 수정: 포커스 가능한 요소들의 ID 배열로 변경
    const gameKeymap = {
        // 일반 순차 이동 (W/S/Up/Down)이 필요한 화면
        "start": ["btn_game_start", "btn_howto_play"],
        "howto": ["btn_close_howto"],
        "clear": ["btn_clear_redo"], 
        "play": ["game-wrapper"], 
        "fail": ["btn_replay", "btn_fail_redo"],
        "select": "grid" // 특수 처리 (그리드 로직이 별도)
    };
    let currentFocusList = [];
    let virtualFocusedEl = null;
    const lastFocusedByScene = {};
    const pressedKeys = new Set();
    let keyboardSuppressedUntil = 0;

    // 키 상태 및 시각적 pressed 상태 초기화
    function clearPressedState() {
        pressedKeys.clear();
        // pressed 클래스를 모두 제거
        try {
            const pressedEls = document.querySelectorAll('.pressed');
            pressedEls.forEach(el => el.classList.remove('pressed'));
        } catch (e) {}
    }

    // 가상 포커스 설정 함수
    function setVirtualFocus(el, options) {
        const suppressSound = options && options.suppressSound;

        if (!el.id) return;

        if (el.id=='btnBgm') return;

        if (el.id=='btnHome') return;

        if (!el) return;
        if (virtualFocusedEl === el) return;
        // 이전 포커스 제거
        if (virtualFocusedEl) {
            virtualFocusedEl.classList.remove('focus'); 
        }
        // 새 포커스 설정
        virtualFocusedEl = el;
        virtualFocusedEl.classList.add('focus');
        if (!suppressSound && virtualFocusedEl && (virtualFocusedEl.tagName === 'BUTTON' || virtualFocusedEl.classList.contains('grid-item'))) {
            playFocusSound();
        }
        // 씬별 마지막 포커스 저장 (요소에 id가 있으면 저장)
        try {
            const sceneEl = el.closest && el.closest('.scene');
            if (sceneEl && sceneEl.id && el.id) {
                lastFocusedByScene[sceneEl.id] = el.id;
            }
        } catch (e) {
            // ignore in older browsers
        }
    }

    // 요소가 실제로 보이는지(렌더링되는지) 확인
    function isElementVisible(el) {
        if (!el) return false;
        // offsetParent is null for display:none or detached elements
        if (el.offsetParent === null && el.getClientRects().length === 0) return false;
        const style = window.getComputedStyle(el);
        if (style.visibility === 'hidden' || style.display === 'none' || parseFloat(style.opacity) === 0) return false;
        return true;
    }

    function clearVirtualFocus() {
        if (virtualFocusedEl) {
            virtualFocusedEl.classList.remove('focus');
            virtualFocusedEl = null;
        }
    }

    // 4. 화면 전환 및 초기 포커스 함수 (수정)
    function changeGameScene(targetSceneId) {

        //console.log(`Changing scene to: ${targetSceneId}`);

        // 씬 전환 시점에 눌린 키/pressed 상태를 초기화하여
        // 이전 씬에서 계속 누르고 있던 키가 새 씬에 영향을 주지 않도록 함
        clearPressedState();
        // 잠깐 키 입력을 무시 (키 릴리즈가 아직 전달되지 않은 경우 보호)
        try { keyboardSuppressedUntil = performance.now() + 220; } catch (e) { keyboardSuppressedUntil = Date.now() + 220; }
        const scenes = document.querySelectorAll('.scene');
        const targetScene = document.getElementById(targetSceneId);

        nowScene = targetSceneId;

        if (!targetScene) {
          return;
        }
        // 목표 씬의 data-type 속성이 "pop"인지 확인
        const isPopUp = targetScene.getAttribute('data-type') === 'pop';

        // "pop" 타입이 아니면 모든 장면 비활성화 및 숨기기 (이전 화면 제거)
        if (!isPopUp) {
            scenes.forEach(scene => {
                scene.classList.remove('active');
            });
        }

        // 목표 장면 활성화 및 표시
        targetScene.classList.add('active');
        if(targetSceneId == 'select'){          
          updateClearedStatus();//아이콘에 마커 표시
        }
        if(targetSceneId == 'select' || targetSceneId == 'play'){            
            setBGMusic(true); //배경음악 재생
        } else {
            setBGMusic(false); //배경음악 중지
        }          

        // 포커스 설정 로직 (가상 포커스: .focus 클래스 사용)
        const keymapValue = gameKeymap[targetSceneId];

        // 1. 순차 이동 배열이 지정된 경우
        if (Array.isArray(keymapValue)) {
            currentFocusList = keymapValue.map(id => document.getElementById(id)).filter(el => el);
            if (currentFocusList.length > 0) {
                // 우선 보이는 요소를 찾아서 포커스를 주고, 타이밍 문제 대비 requestAnimationFrame으로 스케줄
                // 하지만 먼저 씬에 이전에 포커스된 항목이 있는지 확인하여 복원 시도
                const prevId = lastFocusedByScene[targetSceneId];
                let candidate = null;
                if (prevId) {
                    const prevEl = document.getElementById(prevId);
                    if (prevEl && currentFocusList.includes(prevEl) && isElementVisible(prevEl)) {
                        candidate = prevEl;
                    }
                }
                const firstVisible = candidate || currentFocusList.find(isElementVisible) || currentFocusList[0];
                requestAnimationFrame(() => setVirtualFocus(firstVisible, { suppressSound: true }));
            } else {
                clearVirtualFocus();
            }
        }
        // 2. 그리드 이동 (특수 처리)
        else if (keymapValue === "grid") {
            
            // grid 씬은 마지막 포커스 복원 우선, 없으면 첫 그리드
            const prevId = lastFocusedByScene[targetSceneId];
            //console.log('Restoring focus for scene:', targetSceneId, 'previously focused ID:', prevId);
            let candidate = null;
            if (prevId) {
                const prevEl = document.getElementById(prevId);
                if (prevEl && prevEl.classList.contains('grid-item') && isElementVisible(prevEl)) candidate = prevEl;
            }
            const firstGrid = document.getElementById("btn_character_01");
            const focusEl = candidate || firstGrid;
            if (focusEl) requestAnimationFrame(() => setVirtualFocus(focusEl, { suppressSound: true }));
            else clearVirtualFocus();

        }
        // 3. 기타 일반 화면
        else if (typeof keymapValue === 'string') {
              const initialFocusEl = document.getElementById(keymapValue);
              if (initialFocusEl) {
                  // 일반 화면도 이전 포커스가 있으면 복원
                  const prevId = lastFocusedByScene[targetSceneId];
                  const prevEl = prevId ? document.getElementById(prevId) : null;
                  const focusEl = (prevEl && isElementVisible(prevEl)) ? prevEl : initialFocusEl;
                  requestAnimationFrame(() => setVirtualFocus(focusEl, { suppressSound: true }));
              } else {
                  clearVirtualFocus(); // 씬 자체에 포커스 대신 가상 포커스 없음
              }
              currentFocusList = []; // 순차 이동 리스트 초기화
        }
    }

    // Keyboard handlers are registered/unregistered by enableKeyboard/disableKeyboard.
    let _keyDownHandler = null;
    let _keyUpHandler = null;

    function enableKeyboard() {
        if (_keyDownHandler) return; // already enabled
        _keyDownHandler = function(e) {
            // 짧은 기간 동안 키 입력을 무시 (씬 전환 보호)
            try {
                if (performance.now() < keyboardSuppressedUntil) return;
            } catch (err) {
                if (Date.now() < keyboardSuppressedUntil) return;
            }

            const activeScene = document.querySelector('.scene.active');
            if (!activeScene) return;

            const rawKey = (e.key || '').toString();
            let key = rawKey.toLowerCase();
            if (key === ' ') key = 'space';
            if (key === 'spacebar') key = 'space';

            // 이미 눌린 키이면 반복 이벤트 무시
            if (pressedKeys.has(key)) return;
            pressedKeys.add(key);

            const isVerticalKey = ['w', 's', 'arrowup', 'arrowdown'].includes(key);
            const isHorizontalKey = ['a', 'd', 'arrowleft', 'arrowright'].includes(key);

            // Enter / Space 처리: 가상 포커스된 요소 클릭 트리거
            if (key === 'enter' || key === 'space') {
                if (virtualFocusedEl && typeof virtualFocusedEl.click === 'function') {
                    e.preventDefault();
                    playPressSound();
                    virtualFocusedEl.click();
                    virtualFocusedEl.classList.add('pressed');
                }
                return;
            }

            // 그리드 이동 로직 (select 씬)
            if (activeScene.id === 'select' && virtualFocusedEl && virtualFocusedEl.classList.contains('grid-item') && (isVerticalKey || isHorizontalKey)) {
                const currentEl = virtualFocusedEl;
                const maxRow = 2; // 행 인덱스: 0, 1, 2
                const maxCol = 3; // 열 인덱스: 0, 1, 2, 3
                const cols = 4;   // 총 열의 개수

                let currentRow = parseInt(currentEl.getAttribute('data-row'));
                let currentCol = parseInt(currentEl.getAttribute('data-col'));
                let nextRow = currentRow;
                let nextCol = currentCol;

                switch (key) {
                    case 'w': case 'arrowup':
                        nextRow = Math.max(0, currentRow - 1);
                        break;
                    case 's': case 'arrowdown':
                        nextRow = Math.min(maxRow, currentRow + 1);
                        break;
                    case 'a': case 'arrowleft':
                        nextCol = Math.max(0, currentCol - 1);
                        break;
                    case 'd': case 'arrowright':
                        nextCol = Math.min(maxCol, currentCol + 1);
                        break;
                }

                const charIndex = (nextRow * cols) + nextCol + 1;
                const charNumber = charIndex.toString().padStart(2, '0');
                const nextElementId = `btn_character_${charNumber}`;
                const nextEl = document.getElementById(nextElementId);

                if (nextEl) {
                    setVirtualFocus(nextEl);
                    e.preventDefault();
                } else {
                    console.error(`[Grid Error] ID ${nextElementId} (Index: ${nextRow}, ${nextCol}) not found.`);
                }
                return;
            }

            // 순차 이동 로직 (start, fail 등)
            if (currentFocusList.length > 0 && isVerticalKey) {
                let currentIndex = currentFocusList.findIndex(el => el === virtualFocusedEl);
                if (currentIndex === -1) currentIndex = 0;
                let nextIndex = currentIndex;
                const total = currentFocusList.length;

                if (key === 'w' || key === 'arrowup') {
                    nextIndex = (currentIndex - 1 + total) % total;
                } else if (key === 's' || key === 'arrowdown') {
                    nextIndex = (currentIndex + 1) % total;
                }

                if (nextIndex !== currentIndex) {
                    setVirtualFocus(currentFocusList[nextIndex]);
                    e.preventDefault();
                }
                return;
            }
        };

        _keyUpHandler = function(e) {
            const rawKey = (e.key || '').toString();
            let key = rawKey.toLowerCase();
            if (key === ' ') key = 'space';
            if (key === 'spacebar') key = 'space';
            // 누른 키 상태에서 제거
            try { pressedKeys.delete(key); } catch (err) {}

            // 모든 pressed 시각적 상태 제거 (간단하고 안전한 방식)
            try {
                const pressedElements = document.querySelectorAll('.pressed');
                pressedElements.forEach(el => el.classList.remove('pressed'));
            } catch (err) {}
        };

        document.addEventListener('keydown', _keyDownHandler);
        document.addEventListener('keyup', _keyUpHandler);
    }

    function disableKeyboard() {
        if (_keyDownHandler) {
            document.removeEventListener('keydown', _keyDownHandler);
            _keyDownHandler = null;
        }
        if (_keyUpHandler) {
            document.removeEventListener('keyup', _keyUpHandler);
            _keyUpHandler = null;
        }
        // 키 상태 및 시각적 상태 초기화
        try { clearPressedState(); } catch (e) {}
    }

    //언어 선택
    function toggleLanguageSelect(){
      const langBtn = document.querySelector('.language-select-button');
      if(langBtn.classList.contains('active')){
        langBtn.classList.remove('active')
      } else {
        langBtn.classList.add('active')
      }
    }

    //클리어 목록에 있으면 아이콘에 마커 표시함
    function updateClearedStatus() {
      const gridItems = document.querySelectorAll('.grid-item');
      gridItems.forEach(item => {
          // 1. data-no 값을 정수로 변환합니다.
          const itemNo = parseInt(item.getAttribute('data-no'), 10);          
          // 2. 클래스 추가/제거 여부를 결정합니다.
          if (!isNaN(itemNo) && clearedGame.includes(itemNo)) {
              // clearedGame 포함되어 있으면 'cleared' 클래스 추가
              if (!item.classList.contains('cleared')) {
                  item.classList.add('cleared');
              }
          } else {
              // clearedGame 없으면 'cleared' 클래스 제거 (혹시 남아있을 경우 대비)
              if (item.classList.contains('cleared')) {
                  item.classList.remove('cleared');
              }
          }
      });
    }
    
    // 초기 설정 함수: HTML 로드 후 실행
    document.addEventListener('DOMContentLoaded', () => {

        // 모든 grid-item에 tabindex="0" 설정
        document.querySelectorAll('.grid-item').forEach(el => {
            el.setAttribute('tabindex', '0');
        });

        // scene div 자체에 tabindex="-1" 설정 (스크립트 포커스 타겟용)
        document.querySelectorAll('.scene').forEach(el => {
            el.setAttribute('tabindex', '-1'); 
        });

        // 화면 전환 버튼 이벤트 리스너 추가
        // PLAY 버튼
        document.getElementById('btn_game_start').addEventListener('click', () => {
            unlockAudioOnce();
            changeGameScene('select');
            playBGMusic();

            //GA, FB 픽셀 이벤트 전송
            gtag('event', 'minigame_play_2512');
            fbq('track', 'minigame_play_2512');
        });
        // HOW TO PLAY 버튼
        document.getElementById('btn_howto_play').addEventListener('click', () => {
            changeGameScene('howto');

            //GA, FB 픽셀 이벤트 전송
            gtag('event', 'minigame_howto_2512');
            fbq('track', 'minigame_howto_2512');
        });
        // HOW TO PLAY 닫기 버튼
        document.getElementById('btn_close_howto').addEventListener('click', () => {
            changeGameScene('start');
        });
        // CLEAR 화면 - 캐릭터 선택 버튼
        document.getElementById('btn_clear_redo').addEventListener('click', () => {
            changeGameScene('select');

            //GA, FB 픽셀 이벤트 전송
            gtag('event', 'minigame_rechoice_2512');
            fbq('track', 'minigame_rechoice_2512');
        });
        // FAIL 화면 - 캐릭터 선택 버튼
        document.getElementById('btn_fail_redo').addEventListener('click', () => {
            changeGameScene('select');

            //GA, FB 픽셀 이벤트 전송
            gtag('event', 'minigame_rechoice_2512');
            fbq('track', 'minigame_rechoice_2512');
        });
        // FAIL 화면 - 다시하기
        document.getElementById('btn_replay').addEventListener('click', () => {
            changeGameScene('play'); //게임 화면으로 이동
            try { disableKeyboard(); } catch (e) {}
            restartGame();

            //GA, FB 픽셀 이벤트 전송
            gtag('event', 'minigame_retry_2512');
            fbq('track', 'minigame_retry_2512');
        });

        document.getElementById('btnHome').addEventListener('click', () => {
            if (nowScene === 'play'){
                triggerGameStop();
            }
            changeGameScene('start');
            playPressSound();
            try { enableKeyboard(); } catch (e) {}
        });

        document.getElementById('btnBgm').addEventListener('click', () => {
            isBGM = !isBGM; 
            if(isBGM){
                document.getElementById('btnBgm').classList.remove('off');
            } else {
                document.getElementById('btnBgm').classList.add('off');
            }

            if(nowScene == 'select' || nowScene == 'play'){
                setBGMusic(isBGM);
            }
            playPressSound();
        });

        // 캐릭터 선택 버튼
        const gridItems = document.querySelectorAll('.grid-item');
        gridItems.forEach(item => { 
            item.addEventListener('click', (event) => {   
              const itemNo = parseInt(item.getAttribute('data-no'), 10);  
              if (itemNo >= characterMax || itemNo < 0) {
                  return;
              }
              changeGameScene('play'); //게임 화면으로 이동
              cardSelect(itemNo); //#### 선택한 캐릭터 번호 넘김
          });
        });

        // 클릭/터치시 가상 포커스 동기화 (모바일/마우스 지원)
        document.addEventListener('click', function(e) {
            const el = e.target.closest('.grid-item, button');
            if (el) {
                setVirtualFocus(el);
                if (el.tagName === 'BUTTON' || el.classList.contains('grid-item')) {
                    playPressSound();
                }
            }
        });

        document.addEventListener('pointerenter', function(e) {
            const el = e.target.closest && e.target.closest('.grid-item, button');
            if (el) {
                setVirtualFocus(el);
            }
        }, { capture: true });

        function _unlockHandler() { unlockAudioOnce(); }
        document.addEventListener('pointerdown', _unlockHandler, { once: true });
        document.addEventListener('keydown', _unlockHandler, { once: true });

    // WASD/방향키 포커스 이동 로직 활성화
    enableKeyboard();        
        // 초기 화면 포커스 설정
        changeGameScene('start'); 
        document.body.classList.add('init');
        setTimeout(() => {
            document.body.style.overflow = 'auto'
        }, 1500);
    });

    //클리어 목록에 추가
    function addClearedGame(idx) {
      // includes()로 중복 확인, 중복이 아닐 때만 push() 실행
      if (!clearedGame.includes(idx)) {
          clearedGame.push(idx);
          clearedGame.sort((a, b) => a - b); // 정렬
          return true;
      }
      return false;
    }


    // 게임 캐릭터 선택했을 때
    function cardSelect(idx){
        // 명시적으로 undefined/null 여부만 검사하여 0을 올바르게 처리하도록 함
        if (typeof idx !== 'undefined' && idx !== null) {
                selectStage = idx;
        }
        // disable keyboard while actual gameplay runs
        try { disableKeyboard(); } catch (e) {}

        //GA, FB 픽셀 이벤트 전송
        gtag('event', 'minigame_' + GA_SELECT_VALUE[idx] + '_2512');
        fbq('track', 'minigame_' + GA_SELECT_VALUE[idx] + '_2512');

        startGame();
    }

    // 게임 클리어
    function clearGame(){
        addClearedGame(selectStage);
        playCharacterVideo(selectStage);
        changeGameScene('clear');
        try { enableKeyboard(); } catch (e) {}
    }
    // 클리어 실패
    function failGame(){
        changeGameScene('fail');
        try { enableKeyboard(); } catch (e) {}
    }

        
    //캐릭터 모션 영상 제어
    function playCharacterVideo(no){
        const filePath = `assets/video/`;
        const videoFileName = stageName[no]; //전체 비디오 수급시

        const videoPlayer = document.getElementById('videoPlayer');
        videoPlayer.innerHTML = `
            <video autoplay muted loop playsinline id="clearVideo">
                <source src="${filePath}${videoFileName}.mov" type="video/mp4; codecs=hvc1">
                <source src="${filePath}${videoFileName}.webm" type="video/webm">
                Your browser does not support the video tag.
            </video>
        `;
        const video = document.getElementById('clearVideo');
        if (video) {
            video.play();
        }
    }

// 모바일 기기 감지 및 리다이렉트 & 파라미터 처리
(function () {
    let locale;
    const scripts = document.getElementsByTagName('script');
    const currentScript = scripts[scripts.length - 1];
    const src = currentScript.src;
    const url = new URL(src);

    locale = url.searchParams.get('lang');

    function isMobileDevice() {
        return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );
    }
    var isMobile = isMobileDevice();

    if (isMobile){
        var target = (locale ? locale : '') + '/m/';
        var query = window.location.search || '';
        var hash = window.location.hash || '';
        location.replace(target + query + hash);
    }
})();


const GA_SELECT_VALUE = ['loen1','loen2','morpeah1','morpeah2','eclipse1','eclipse2','celia1','celia2','zenith1','darian1','eleaneer1','tyr1'];