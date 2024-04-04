const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");

// 게임 설정 값
const config = {
    ballRadius: 10,
    brickRow: 3,
    brickColumn: 6,
    brickWidth: 75,
    brickHeight: 20,
    brickPadding: 5,
    brickTop: 30,
    randomBrick: 0.3,
    randomBrickIncrement: 0.1,
    paddleHeight: 10,
    paddleWidth: 100
};

let { ballRadius, brickRow, brickColumn, brickWidth, brickHeight, brickPadding, brickTop, randomBrick, randomBrickIncrement, paddleHeight, paddleWidth } = config;

let currentRound = 1;
let score = 0; // 스코어 변수 추가

// 게임 시작 버튼 참조
const startButton = document.querySelector("#startGame");
const saveButton = document.querySelector("#scoreSave");

// 시작 버튼 클릭 이벤트 리스너
startButton.addEventListener("click", function () {
    startButton.style.display = "none";  // 시작 버튼 숨김
    initializeGame();
});

// 게임 초기화
function initializeGame() {
    currentRound = 1;
    score = 0; // 스코어 초기화
    bricks = createBricks();
    keysPressed = {};

    paddleX = (canvas.width - paddleWidth) / 2;

    startGame();
}

// 게임 재시작
function restartGame() {
    startButton.style.display = "block";  // 시작 버튼 보이기
    saveButton.style.display = "block";
    keysPressed = {};
    paddleX = (canvas.width - paddleWidth) / 2;
}

// 벽돌 생성 함수
function createBricks() {
    const bricks = [];
    for (let column = 0; column < brickColumn; column++) {
        bricks[column] = [];
        for (let row = 0; row < brickRow; row++) {
            const reinForcedBrick = Math.random() < randomBrick; // 강화된 벽돌 여부
            const status = reinForcedBrick ? 2 : 1;
            const brickX = column * (brickWidth + brickPadding);
            const brickY = row * (brickHeight + brickPadding) + brickTop;
            bricks[column][row] = { x: brickX, y: brickY, status };
        }
    }
    return bricks;
}

// 벽돌 초기화 함수
function resetBricks() {
    for (let column = 0; column < brickColumn; column++) {
        for (let row = 0; row < brickRow; row++) {
            const reinForcedBrick = Math.random() < (randomBrick + randomBrickIncrement * currentRound);
            bricks[column][row].status = reinForcedBrick ? 2 : 1;
        }
    }
}

let bricks = createBricks();
let paddleX = (canvas.width - paddleWidth) / 2;

// 키보드 입력 처리
const keyMap = {
    ArrowRight: "right",
    ArrowLeft: "left"
};

let keysPressed = {};

document.addEventListener("keydown", keyHandler);
document.addEventListener("keyup", keyHandler);

function keyHandler(e) {
    const key = keyMap[e.key];
    if (key !== undefined) {
        keysPressed[key] = e.type === "keydown";
    }
}

// 공 그리기
function drawBall(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

// 패들 그리기
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
}

// 벽돌 그리기
function drawBricks() {
    for (let column = 0; column < brickColumn; column++) {
        for (let row = 0; row < brickRow; row++) {
            const brick = bricks[column][row];
            if (brick.status > 0) {
                ctx.beginPath();
                ctx.rect(brick.x, brick.y, brickWidth, brickHeight);
                ctx.fillStyle = brick.status === 2 ? "red" : "green";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// 충돌 감지 함수
function collisionDetection(x, y, dx, dy) {
    for (let column = 0; column < brickColumn; column++) {
        for (let row = 0; row < brickRow; row++) {
            const brick = bricks[column][row];
            if (brick.status > 0) {
                // 공의 바깥 부분 좌표를 계산
                const ballLeft = x + dx - ballRadius;
                const ballRight = x + dx + ballRadius;
                const ballTop = y + dy - ballRadius;
                const ballBottom = y + dy + ballRadius;

                // 벽돌 좌표
                const brickLeft = brick.x;
                const brickRight = brick.x + brickWidth;
                const brickTop = brick.y;
                const brickBottom = brick.y + brickHeight;

                // 충돌 감지
                if (
                    ballRight > brickLeft &&
                    ballLeft < brickRight &&
                    ballBottom > brickTop &&
                    ballTop < brickBottom
                ) {
                    if (brick.status === 2) {
                        brick.status = 1;
                        score += 50; // 스코어 업데이트
                    } else {
                        brick.status = 0;
                        score += 100;
                    }
                    return true;
                }
            }
        }
    }
    return false;
}

// 게임 승리 확인
function checkForWin() {
    for (let column = 0; column < brickColumn; column++) {
        for (let row = 0; row < brickRow; row++) {
            if (bricks[column][row].status > 0) {
                return false;
            }
        }
    }

    resetBricks();
    startGame();
    return true;
}
function drawScore() {
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, 8, 20); // 스코어를 (8, 20) 위치에 표시
}
// 게임 루프 시작
function startGame() {
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 3 + currentRound;
    let dy = -(3 + currentRound);

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);  // 화면 지우기
        ctx.strokeStyle = "black";  // 테두리 선 색상 설정
        ctx.strokeRect(0, 0, canvas.width, canvas.height);  // 캔버스 테두리 그리기

        drawBall(x, y);
        drawPaddle();
        drawBricks();
        drawScore();

        // 충돌 감지
        if (collisionDetection(x, y, dx, dy) || y + dy < ballRadius) {
            dy = -dy;
        }
        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy > canvas.height - ballRadius) {
            if (x + ballRadius > paddleX && x - ballRadius < paddleX + paddleWidth) {
                dy = -dy;
                if (keysPressed["right"]) {
                    dx = Math.abs(dx);
                } else if (keysPressed["left"]) {
                    dx = -Math.abs(dx);
                }
            } else {
                cancelAnimationFrame(requestId);
                alert("Game Over!");
                restartGame();
                return;
            }
        }

        if (checkForWin()) {
            cancelAnimationFrame(requestId);
            alert(`Round ${currentRound} cleared!`);
            currentRound++;
            restartGame();
            resetBricks();
            startButton.style.display = "none";
            saveButton.style.display = "none";
            return;
        }

        // 패들 움직임
        if (keysPressed["right"] && paddleX + paddleWidth < canvas.width) {
            paddleX += 7;
        }
        if (keysPressed["left"] && paddleX > 0) {
            paddleX -= 7;
        }
        x += dx;
        y += dy;
        requestId = requestAnimationFrame(gameLoop);
    }

    let requestId = requestAnimationFrame(gameLoop);
}   
// "점수판 보기" 버튼을 클릭했을 때 호출되는 함수
function viewScoreboard() {
    const table = document.querySelector('table');
    const scoreboardButton = document.querySelector('#viewScoreboard');

    if (table.style.display === 'none' || table.style.display === '') {
        table.style.display = 'table'; // 숨겨져 있거나 초기에 숨겨져 있으면 보이도록 설정
        scoreboardButton.textContent = '점수판 숨기기'; // 버튼 텍스트 변경
    } else {
        table.style.display = 'none'; // 이미 보이면 숨김
        scoreboardButton.textContent = '점수판 보기'; // 버튼 텍스트 변경
    }
}

