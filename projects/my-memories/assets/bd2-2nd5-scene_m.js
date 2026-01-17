
document.addEventListener('gesturestart', e => e.preventDefault());
document.addEventListener('gesturechange', e => e.preventDefault());
document.addEventListener('gestureend', e => e.preventDefault());

let isBGM = true;
let nowScene;
let select_lastFocused = 0;

const characterMax = 12;
let clearedGame = [];

const gameKeymap = {
    // 일반 순차 이동 (W/S/Up/Down)이 필요한 화면
    "start": ["btn_game_start", "btn_howto_play"],
    "howto": ["btn_close_howto"],
    "select": Array.from({ length: characterMax }, (_, i) => `btn_character_${i}`), 
    "clear": ["btn_clear_redo"], 
    "play": ["canvas"], 
    "fail": ["btn_replay", "btn_fail_redo"],
};

    const audioFiles = {
        bg: 'assets/audio/bg-music.mp3',
        focus: 'assets/audio/btn-focus.mp3',
        press: 'assets/audio/btn-press.mp3'
    };
    let audioUnlocked = true;
    const bgAudio = new Audio(audioFiles.bg);
    bgAudio.loop = true;
    bgAudio.preload = 'auto';
    bgAudio.volume = 0.3;

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
    }

    function playBGMusic() {
        if (!isBGM) return;
        if (!audioUnlocked) return;
        bgAudio.play().catch(() => {});
    }

    function setBGMusic(enabled) {
        try {
            if (enabled) {
                if (!isBGM) return;
                if (!audioUnlocked) return;
                bgAudio.play().catch(() => {});
            } else {
                try { bgAudio.pause(); } catch (e) {}
                try { bgAudio.currentTime = 0; } catch (e) {}
            }
        } catch (e) {
        }
    }

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

    

    function changeGameScene(targetSceneId) {
        const scenes = document.querySelectorAll('.scene');
        const targetScene = document.getElementById(targetSceneId);

        if (nowScene === "howto"){
            const target = document.getElementById('howto');
            target.classList.remove('active');
            nowScene = targetSceneId;
            return;
        } else {
            nowScene = targetSceneId;
        }
        

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

        if(targetSceneId == 'start'){
            changeFocusedButton('start', 'now', 0);
        }

        if(targetSceneId == 'select'){          
            updateClearedStatus();//아이콘에 마커 표시
        }

        if(targetSceneId == 'play'){
            enableContinuousRepeat = true;
        }

        if(targetSceneId == 'select' || targetSceneId == 'play'){            
            setBGMusic(true); //배경음악 재생
        } else {
            setBGMusic(false); //배경음악 중지
        }

        if(targetSceneId == 'fail'){

            changeFocusedButton('fail', 'now', 0);
            // focus 초기화
            // const sceneEl = document.getElementById(targetSceneId);
            // const keymap = gameKeymap[targetSceneId];
            // keymap.forEach(id => {
            //     const el = sceneEl.querySelector(`#${id}.focus`);
            //     if (el) el.classList.remove("focus");
            // });
        }

        if(targetSceneId == 'clear'){

            //changeFocusedButton('clear', 'now', 0);
            // focus 초기화
            const sceneEl = document.getElementById(targetSceneId);
            const keymap = gameKeymap[targetSceneId];
            keymap.forEach(id => {
                const el = sceneEl.querySelector(`#${id}.focus`);
                if (el) el.classList.remove("focus");
            });
        }

        
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

            // 마지막 선택 케릭터
            if (!isNaN(itemNo) && itemNo === select_lastFocused) {
                item.classList.add('focus');
            } else {
                item.classList.remove('focus');
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
            // user intentionally started the game: unlock audio and start background music
            unlockAudioOnce();
            changeGameScene('select');
            playBGMusic();

            playPressSound();

            //GA, FB 픽셀 이벤트 전송
            gtag('event', 'minigame_play_2512');
            fbq('track', 'minigame_play_2512');
        });
        // HOW TO PLAY 버튼
        document.getElementById('btn_howto_play').addEventListener('click', () => {
            changeGameScene('howto');
            playPressSound();

            //GA, FB 픽셀 이벤트 전송
            gtag('event', 'minigame_howto_2512');
            fbq('track', 'minigame_howto_2512');
        });
        // HOW TO PLAY 닫기 버튼
        document.getElementById('btn_close_howto').addEventListener('click', () => {
            changeGameScene('start');
            playPressSound();
        });
        // CLEAR 화면 - 캐릭터 선택 버튼
        document.getElementById('btn_clear_redo').addEventListener('click', () => {
            changeGameScene('select');
            playPressSound();

            //GA, FB 픽셀 이벤트 전송
            gtag('event', 'minigame_rechoice_2512');
            fbq('track', 'minigame_rechoice_2512');
        });
        // FAIL 화면 - 캐릭터 선택 버튼
        document.getElementById('btn_fail_redo').addEventListener('click', () => {
            changeGameScene('select');  
            playPressSound();

            //GA, FB 픽셀 이벤트 전송
            gtag('event', 'minigame_rechoice_2512');
            fbq('track', 'minigame_rechoice_2512');
        });
        // FAIL 화면 - 다시하기
        document.getElementById('btn_replay').addEventListener('click', () => {
            changeGameScene('play'); //게임 화면으로 이동
            //cardSelect(selectStage); //#### 번호가 없으면 기존 캐릭터로 진행
            restartGame();
            playPressSound();

            //GA, FB 픽셀 이벤트 전송
            gtag('event', 'minigame_retry_2512');
            fbq('track', 'minigame_retry_2512');
        });

        // 홈버튼
        document.getElementById('btnHome').addEventListener('click', () => {
            if (nowScene === 'play'){
                triggerGameStop();
            }
            changeGameScene('start');
            playPressSound();
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

        for (let i = 0; i < characterMax; i++) {
            const buttonId = `btn_character_${String(i)}`;
            const button = document.getElementById(buttonId);
            const stageIndex = i;
            button.addEventListener('click', () => {
                changeGameScene('play');
                cardSelect(stageIndex);
                playPressSound();
            });
        }

        
        // unlock audio on first user gesture (pointerdown or keydown)
        function _unlockHandler() { unlockAudioOnce(); }
        document.addEventListener('pointerdown', _unlockHandler, { once: true });
        document.addEventListener('keydown', _unlockHandler, { once: true });

    
        // 초기 화면 포커스 설정
        changeGameScene('start'); 

        document.body.classList.add('init');

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
            select_lastFocused = idx;
        }
        
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
    }
    // 클리어 실패
    function failGame(){
        changeGameScene('fail');
    }

        
    //캐릭터 모션 영상 제어
    function playCharacterVideo(no){
        const filePath = 'assets/video/m/';
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

const directionStatus = document.getElementById('directionStatus');
const actionStatus = document.getElementById('actionStatus');
const activePointers = new Map(); // pointerId -> { label: string|null, button: HTMLElement|null }
let spacePressCount = 0;

const keyEventConfig = {
    UP: { key: 'ArrowUp', code: 'ArrowUp', keyCode: 38, which: 38 },
    DOWN: { key: 'ArrowDown', code: 'ArrowDown', keyCode: 40, which: 40 },
    LEFT: { key: 'ArrowLeft', code: 'ArrowLeft', keyCode: 37, which: 37 },
    RIGHT: { key: 'ArrowRight', code: 'ArrowRight', keyCode: 39, which: 39 },
    SPACE: { key: ' ', code: 'Space', keyCode: 32, which: 32 }
};

// 키패드와 추가 버튼 입력을 연결하고 필요한 전역 리스너를 등록한다.
function wireControls() {
    const buttons = document.querySelectorAll('button[data-direction]');
    buttons.forEach((button) => {
        button.addEventListener('pointerdown', (event) => {
            event.preventDefault();
            button.setPointerCapture?.(event.pointerId);

            if (nowScene !== 'play'){
                keypadPress(button.dataset.direction);
            } else {
                engageButton(button, event.pointerId);
            }
        });

        ['pointerup', 'pointercancel'].forEach((eventName) => {
            button.addEventListener(eventName, (event) => releasePointer(event));
        });
    });

    // window.addEventListener('keydown', (event) => {
    // 	const keyMap = {
    // 		ArrowUp: 'UP',
    // 		ArrowDown: 'DOWN',
    // 		ArrowLeft: 'LEFT',
    // 		ArrowRight: 'RIGHT',
    // 		' ': 'SPACE',
    // 		Space: 'SPACE'
    // 	};
    
    // 	const label = keyMap[event.key];
    // 	if (label) {
    // 		event.preventDefault();
    // 		showDirection(label);
    // 	}
    // });

    ['pointerup', 'pointercancel'].forEach((eventName) => {
        window.addEventListener(eventName, (event) => releasePointer(event));
    });

    window.addEventListener('blur', () => releasePointer());
}

wireControls();


// 지정한 방향에 맞춰 가상의 키보드 이벤트를 발생시킨다.
// function showDirection_Fake(label) {
//     const config = keyEventConfig[label];
//     if (!config) {
//         return;
//     }

//     const event = new KeyboardEvent('keydown', {
//         key: config.key,
//         code: config.code,
//         keyCode: config.keyCode,
//         which: config.which,
//         bubbles: true
//     });

//     document.dispatchEvent(event);
// }


function keypadPress(label) {
    if (label !== 'SPACE') {
        if (nowScene === 'start'){
            if (label === 'UP'){
                changeFocusedButton('start', 'prev');
            } else if (label === 'DOWN'){
                changeFocusedButton('start', 'next');
            }
            playFocusSound();
        } else if( nowScene === 'select'){
            const nowPos = select_lastFocused+1;
            const rows=3;
            switch (label) {
                case 'UP':
                    if (nowPos > rows){
                        changePos = nowPos - rows;
                        playFocusSound();
                    }
                    break;
                case 'DOWN':
                    if (nowPos <= (characterMax-rows)){
                        changePos = nowPos + rows;
                        playFocusSound();
                    }
                    break;
                case 'LEFT':
                    if (nowPos != 1){
                        changePos = nowPos -1;
                        playFocusSound();
                    }
                    break;
                case 'RIGHT':
                    if (nowPos != characterMax){
                        changePos = nowPos +1;
                        playFocusSound();
                    }
                    break;
            }
            changeFocusedButton('select', 'now', changePos-1);
            select_lastFocused = changePos -1;
        } else if (nowScene === 'fail'){
            if (label === 'UP'){
                changeFocusedButton('fail', 'prev');
            } else if (label === 'DOWN'){
                changeFocusedButton('fail', 'next');
            }
            playFocusSound();
        } else if (nowScene === 'clear'){
            if (label === 'UP'){
                changeFocusedButton('clear', 'prev');
            } else if (label === 'DOWN'){
                changeFocusedButton('clear', 'next');
            }
            playFocusSound();
        }
    } else {
        // SPACE 처리
        if (nowScene === 'start'){
            getFocusedButtonPress(nowScene);
        } else if (nowScene === 'howto'){
            const target = document.getElementById(gameKeymap['howto'][0]);
            if (target) target.click();
        } else if (nowScene === 'select'){
            const target = document.getElementById(gameKeymap['select'][select_lastFocused]);
            if (target) target.click();
        } else if (nowScene === 'play'){
            //console.log('play scene - space key pressed');
            //showDirection_Fake(label);
        } else if (nowScene === 'clear'){
            getFocusedButtonPress(nowScene);
        } else if (nowScene === 'fail'){
            getFocusedButtonPress(nowScene);
        }
    }
}


// 특정 scene(id)의 활성 focus 버튼 찾기 함수
function changeFocusedButton(sceneId, direction = "now", idx = null) {
    const sceneEl = document.getElementById(sceneId);
    if (!sceneEl) return null;

    const keymap = gameKeymap[sceneId];
    if (!Array.isArray(keymap)) return null;

    // 현재 포커스된 index 찾기
    let currentIndex = keymap.findIndex(id => sceneEl.querySelector(`#${id}.focus`));

    // focus 초기화 함수
    const clearFocus = () => {
        keymap.forEach(id => {
            const el = sceneEl.querySelector(`#${id}.focus`);
            if (el) el.classList.remove("focus");
        });
    };

    // 방향 처리
    if (direction === "prev") {
        if (currentIndex === -1) {
            currentIndex = 0;
        } else {
            clearFocus();
            if (currentIndex > 0) { // 0보다 클 때만 이동
                clearFocus();
                currentIndex = currentIndex - 1;
            } else {
                currentIndex = 0;
            }
            // 순환
            // if (currentIndex === -1) currentIndex = 0;
            // else currentIndex = (currentIndex - 1 + keymap.length) % keymap.length;
        }
    } else if (direction === "next") {
        if (currentIndex === -1) {
            currentIndex = 0;
        } else {
            clearFocus();
            if (currentIndex >= 0 && currentIndex < keymap.length - 1) { // 마지막 전까지만 이동
                clearFocus();
                currentIndex = currentIndex + 1;
            } else {
                currentIndex = keymap.length - 1;
            }
            // 순환
            // if (currentIndex === -1) currentIndex = 0;
            // else currentIndex = (currentIndex + 1) % keymap.length;
        }
    } else if (direction === "now") {
        clearFocus();
        if (idx !== null && idx >= 0 && idx < keymap.length) {
            currentIndex = idx;
        } else {
            // idx가 없거나 잘못된 경우 기존 포커스 유지
            if (currentIndex === -1) return null;
        }
    }

    // 새 focus 적용
    const nextEl = sceneEl.querySelector(`#${keymap[currentIndex]}`);
    if (nextEl) nextEl.classList.add("focus");

    return nextEl;
}

// 특정 scene(id)의 활성 focus 클릭하기
function getFocusedButtonPress(sceneId) {

    const sceneEl = document.getElementById(sceneId);
    if (!sceneEl) return null;

    const keymap = gameKeymap[sceneId];
    if (!Array.isArray(keymap)) return null; // select(grid) 같은 특수 케이스 제외

    for (const btnId of keymap) {
        const el = sceneEl.querySelector(`#${btnId}.focus`);
        if (el) {
            el.click();
        }
    }
}


function sendGameInput(label, type) {
    const config = keyEventConfig[label];
    if (!config) {
        return;
    }

    const key = config.key;
    const handler = type === 'up' ? window.handleGameKeyUp : window.handleGameKeyDown;
    if (typeof handler === 'function') {
        handler(key);
        return;
    }

    const eventType = type === 'up' ? 'keyup' : 'keydown';
    const event = new KeyboardEvent(eventType, {
        key: config.key,
        code: config.code,
        keyCode: config.keyCode,
        which: config.which,
        bubbles: true
    });
    document.dispatchEvent(event);
}

function releasePointer(target) {
    if (target === undefined) {
        activePointers.forEach((action) => {
            if (action.label) {
                sendGameInput(action.label, 'up');
            }
        });
        activePointers.clear();
        return;
    }

    const pointerId = typeof target === 'number'
        ? target
        : (target && typeof target.pointerId === 'number' ? target.pointerId : null);
    if (pointerId === null) {
        return;
    }

    const action = activePointers.get(pointerId);
    if (!action) {
        return;
    }

    if (action.label) {
        sendGameInput(action.label, 'up');
    }
    activePointers.delete(pointerId);
}

function suspendPointer(pointerId) {
    const action = activePointers.get(pointerId);
    if (!action) {
        return;
    }
    if (action.label) {
        sendGameInput(action.label, 'up');
    }
    activePointers.set(pointerId, { label: null, button: null });
}

function engageButton(button, pointerId) {
    if (!button) {
        return;
    }

    const label = button.dataset.direction;
    if (!label) {
        return;
    }

    const current = activePointers.get(pointerId);
    if (current && current.label === label) {
        return;
    }

    if (current && current.label) {
        sendGameInput(current.label, 'up');
    }

    sendGameInput(label, 'down');
    //showDirection(label);
    activePointers.set(pointerId, { label, button });
}

// 누르고 있는 손가락을 다른 방향 버튼으로 이동했을 때 곧바로 방향을 전환한다.
window.addEventListener('pointermove', (event) => {
    const action = activePointers.get(event.pointerId);
    if (!action) {
        return;
    }

    const element = document.elementFromPoint(event.clientX, event.clientY);
    const button = element && element.closest('button[data-direction]');
    const withinGamePad = element && element.closest('.game-pad');
    if (!button) {
        if (nowScene === 'play') {
            return;
        }
        if (withinGamePad) {
            return;
        }
        suspendPointer(event.pointerId);
        return;
    }

    if (!action.button || button !== action.button) {
        engageButton(button, event.pointerId);
    }
}, { passive: false });

// 멀티 터치나 길게 눌러서 브라우저 기본 동작이 실행되지 않도록 막는다.
['contextmenu', 'selectstart'].forEach((type) => {
    document.addEventListener(type, (event) => event.preventDefault());
});

window.addEventListener('touchstart', (event) => {
    if (event.touches && event.touches.length > 1) {
        event.preventDefault();
    }
}, { passive: false });

window.addEventListener('touchmove', (event) => {
    if (event.touches && event.touches.length > 1) {
        event.preventDefault();
    }
}, { passive: false });


function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
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

    if (!isMobile){
        var target = (locale ? locale : '') + '/';
        var query = window.location.search || '';
        var hash = window.location.hash || '';
        location.replace(target + query + hash);
    }
})();

const GA_SELECT_VALUE = ['loen1','loen2','morpeah1','morpeah2','eclipse1','eclipse2','celia1','celia2','zenith1','darian1','eleaneer1','tyr1'];

// /* TEMP */
// function gtag(a,b){console.log("gtag=",b);return false}
// function fbq(a,b){console.log("fbq=",b);return false}