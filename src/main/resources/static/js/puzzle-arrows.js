// 게임 컨트롤 및 피드백을 위한 요소들에 대한 참조
const controls = document.querySelector('#controls');
const scoreBoard = document.querySelector('#score');
const timerBoard = document.querySelector('#timer');
const roundBoard = document.querySelector('#round');
const startBtn = document.querySelector('#startBtn');
const gameName = document.querySelector('#gameName');
const exStart = document.querySelector('#exStart');
const soundEffectBtn = document.querySelector('#toggleSoundEffect');
const bgMusicBtn = document.querySelector('#toggleBgMusic');
const endMessage = document.querySelector('#endMessage');

// 게임 상태를 저장할 변수들 초기화
let score = 0;
let timer;
let timeLeft = 10;
let isPaused = false;
let round = 1;
let isSoundEffectMuted = false;
let isBgMusicMuted = false;
let combo = 0; // 연속 올바른 화살표 제거 카운트

// 이미지 및 방향 데이터 초기화
const imageElements = [];
const directions = ['left', 'right', 'up', 'down'];
const bgAudio = new Audio('/sounds/runaway.mp3');
bgAudio.loop = true;

// 다시 시작 버튼 생성 및 이벤트 리스너 추가
const restartBtn = document.createElement('button');
restartBtn.id = 'restartBtn';
restartBtn.textContent = "다시 시작";
restartBtn.addEventListener('click', restartGame);

// 시작 버튼 클릭 시 실행되는 이벤트 리스너 등록
startBtn.addEventListener('click', startGame);
exStart.style.display = 'none';
roundBoard.style.display = 'none';

// 사운드 이펙트 및 배경 음악 끄기/켜기 버튼 클릭 시 실행되는 이벤트 리스너 등록
soundEffectBtn.addEventListener('click', toggleSoundEffect);
bgMusicBtn.addEventListener('click', toggleBgMusic);

// 게임 시작 함수
function startGame() {
    initializeGameState();
    timer = setInterval(updateGame, 1000);
    document.addEventListener('keydown', handleKeyDown);
    populateImages();

    gameName.style.display = 'none';
    roundBoard.style.display = 'block';
    startBtn.style.display = 'none';
    exStart.style.display = 'block';
    restartBtn.style.display = 'none';

    updateRoundDisplay();  // 라운드 표시 업데이트

    if (!isBgMusicMuted) {
        bgAudio.play();
    }
}

// 게임 상태 초기화 함수
function initializeGameState() {
    timeLeft = Math.max(10 - round, 3);
    combo = 0;
    updateScore();
    updateTimer();
}

// 이미지 생성 및 화살표 랜덤 배치 함수
function populateImages() {
    const numOfArrows = Math.min(10 + round * 2, 30);
    for (let i = 0; i < numOfArrows; i++) {
        createImage(directions[Math.floor(Math.random() * directions.length)]);
    }
}

// 키 이벤트 핸들러 함수
function handleKeyDown(event) {
    let direction;

    playSoundEffect();

    if (event.key.startsWith('Arrow')) {
        direction = event.key.toLowerCase().replace('arrow', '');
        if (removeImage(direction)) {
            combo++;
            score += combo;
        } else {
            combo = 0;
        }
        updateScore();
    }
}

// 사운드 이펙트 재생 함수
function playSoundEffect() {
    if (!isSoundEffectMuted) {
        const audio = new Audio('/sounds/pew.mp3');
        audio.play();
    }
}

// 화살표 제거 함수
function removeImage(direction) {
    const directionImage = document.querySelector(`.${direction}:first-child`);
    if (directionImage) {
        if (imageElements.includes(directionImage)) {
            directionImage.remove();
            const index = imageElements.indexOf(directionImage);
            if (index > -1) {
                imageElements.splice(index, 1);
            }
            if (imageElements.length === 0) {
                round++; // 라운드 증가
                endGame();
            }
            score += 5 + round - 1;
            return true;
        }
    } else {
        score -= 5;
        return false;
    }
}

// 점수 업데이트 함수
function updateScore() {
    scoreBoard.textContent = `점수: ${score}`;
}

// 타이머 업데이트 함수
function updateTimer() {
    timerBoard.textContent = `남은 시간 : ${Math.max(timeLeft, 0)}s`;
}

// 라운드 표시 업데이트 함수
function updateRoundDisplay() {
    roundBoard.textContent = `라운드: ${round}`;
}

// 화살표 이미지 생성 함수
function createImage(direction) {
    const img = document.createElement('img');
    img.classList.add(direction);
    img.src = `/imgs/puzzle-arrows/${direction}.png`;
    img.style.margin = '5px';
    controls.appendChild(img);
    imageElements.push(img);
}

// 게임 업데이트 함수
function updateGame() {
    if (isPaused) return;

    timeLeft--;
    updateTimer();
    if (timeLeft <= 0 || imageElements.length === 0) endGame();
}

// 게임 종료 함수
function endGame() {
    clearInterval(timer);
    document.removeEventListener('keydown', handleKeyDown);
    bgAudio.pause();

    // 모든 이미지가 제거되면 새 라운드 시작
    if (imageElements.length === 0) {
        setTimeout(() => {
            restartGame();
        }, 1000); // 예: 2초 후에 새 라운드 시작
    } else {
        round = 1;
        score = 0;
        timeLeft = 10;
        controls.appendChild(restartBtn);
        restartBtn.style.display = 'block';
    }
}

// 게임 재시작 함수
function restartGame() {
    controls.innerHTML = '';
    imageElements.length = 0;
    initializeGameState();
    updateRoundDisplay();
    populateImages();
    timer = setInterval(updateGame, 1000);
    document.addEventListener('keydown', handleKeyDown);
    if (!isBgMusicMuted) {
        bgAudio.play();
    }
    endMessage.style.display = 'none';
    controls.removeChild(restartBtn);
}

// 사운드 이펙트 끄기/켜기 함수
function toggleSoundEffect() {
    isSoundEffectMuted = !isSoundEffectMuted;
    soundEffectBtn.textContent = isSoundEffectMuted ? '효과음 켜기' : '효과음 끄기';
}

// 배경 음악 끄기/켜기 함수
function toggleBgMusic() {
    isBgMusicMuted = !isBgMusicMuted;
    if (isBgMusicMuted) {
        bgAudio.pause();
    } else {
        bgAudio.play();
    }
    bgMusicBtn.textContent = isBgMusicMuted ? '백그라운드 음악 켜기' : '백그라운드 음악 끄기';
}

// 키보드 이벤트 리스너 등록: 일시정지 기능
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' || event.key === 'p') {
        isPaused = !isPaused;
    }
});

// "점수판 보기" 버튼 클릭 시 호출되는 함수
function viewScoreboard() {
    const table = document.querySelector('table');
    const scoreboardButton = document.querySelector('#viewScoreboard');

    if (table.style.display === 'none' || table.style.display === '') {
        table.style.display = 'table'; // 숨겨져 있거나 초기에 숨겨져 있으면 보이도록 설정
        scoreboardButton.textContent = '점수 숨기기'; // 버튼 텍스트 변경
    } else {
        table.style.display = 'none'; // 이미 보이면 숨김
        scoreboardButton.textContent = '점수 보기'; // 버튼 텍스트 변경
    }
}
