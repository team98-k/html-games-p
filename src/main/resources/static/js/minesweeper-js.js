// 게임 시작 버튼들과 이벤트 리스너 설정
const gameStart = document.querySelector("#gameStart");
const gameStart2 = document.querySelector("#gameStart2");
const gameStart3 = document.querySelector("#gameStart3");

// 모든 타일에 대한 참조를 저장할 배열
let tdArr = [];

// 게임 시작 시간을 저장할 변수
let startTime;

// 지뢰가 배치되었는지 확인하는 플래그
let minesPlaced = false;

// 지뢰 색상 및 타일 주변의 지뢰 수에 따른 색상 배열
const MINE_COLOR = "red";
const COLORS = ["black", "green", "blue", "purple", "maroon", "turquoise", "black", "gray"];

// 게임 시작 버튼에 대한 클릭 이벤트 리스너 설정
gameStart.addEventListener("click", () => setGame(9, 9, 10, 1));
gameStart2.addEventListener("click", () => setGame(12, 12, 40, 2));
gameStart3.addEventListener("click", () => setGame(16, 16, 70, 3));

// 게임 설정 함수: 행, 열, 지뢰 수, 난이도에 따라 게임 초기화
function setGame(row, col, mines, point) {
    minesPlaced = false;
    document.querySelector("#mineBoard").innerHTML = '';
    generateBoard(row, col);
    tdArr = Array.from(document.querySelectorAll("#mineBoard td"));

    for (let i = 0; i < tdArr.length; i++) {
        tileEvent(i, getAroundArr(i, row, col), row, col, mines, point);
    }

    startTime = new Date();
}

// 게임 보드 생성 함수: 주어진 행과 열에 맞게 테이블 생성
function generateBoard(row, col) {
    let board = '<table border="1">';
    for (let i = 0; i < col; i++) {
        board += '<tr>';
        for (let j = 0; j < row; j++) {
            board += '<td></td>';
        }
        board += '</tr>';
    }
    board += '</table>';
    document.querySelector("#mineBoard").innerHTML = board;
}

// 지뢰 생성 및 배치 함수: 특정 인덱스를 제외하고 주어진 개수만큼 랜덤한 지뢰 생성 및 배치
function createAndPlaceMines(excludeIndex, mineNum, totalTiles, row, col) {
    let mineArr = generateRandomMines(mineNum, totalTiles, excludeIndex, row, col);
    putMineInBoard(mineArr);
}

// 랜덤한 지뢰 인덱스 배열 생성 함수
function generateRandomMines(mineNum, totalTiles, excludeIndex, row, col) {
    let mineArr = [];
    while (mineArr.length < mineNum) {
        const randomNum = Math.floor(Math.random() * totalTiles);
        if (!mineArr.includes(randomNum) && randomNum !== excludeIndex && !getAroundArr(excludeIndex, row, col).includes(randomNum)) {
            mineArr.push(randomNum);
        }
    }
    return mineArr;
}

// 지뢰를 보드에 배치하는 함수
function putMineInBoard(mines) {
    for (let i = 0; i < tdArr.length; i++) {
        if (mines.includes(i)) {
            tdArr[i].classList.add("mines");
        }
    }
}

// 주어진 인덱스 주변의 인덱스 배열을 반환하는 함수
function getAroundArr(num, row, col) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    const currRow = Math.floor(num / col);
    const currCol = num % col;
    const aroundArr = [];

    for (let i = 0; i < directions.length; i++) {
        const newRow = currRow + directions[i][0];
        const newCol = currCol + directions[i][1];

        if (newRow >= 0 && newRow < row && newCol >= 0 && newCol < col) {
            aroundArr.push(newRow * col + newCol);
        }
    }

    return aroundArr;
}

// 타일 클릭 처리 함수
function handleTileClick(targetNum, aroundArr, row, col, mines, point) {
    const tile = tdArr[targetNum];

    // 지뢰가 아직 배치되지 않았다면
    if (!minesPlaced) {
        createAndPlaceMines(targetNum, mines, row * col, row, col);
        minesPlaced = true;
    }

    // 이미 열려 있거나 깃발, 물음표가 있는 상태라면 클릭 무시
    if (tile.dataset.isOpen === "true" || tile.classList.contains("flag") || tile.classList.contains("qmark")) return;

    // 클릭한 타일에 지뢰가 있다면 게임 오버 처리
    if (tile.classList.contains("mines")) {
        tile.style.backgroundColor = MINE_COLOR;
        tile.textContent = "X";
        gameOver(point);
    } else {
        // 주변에 지뢰가 몇 개 있는지 계산
        const mineCount = aroundArr.filter((num) => tdArr[num].classList.contains("mines")).length;

        // 주변에 지뢰가 없다면
        if (mineCount === 0) {
            openTile(tile, "");
            // 주변 타일들을 재귀적으로 엽니다.
            aroundArr.forEach((num) => {
                const adjacentTile = tdArr[num];
                if (!adjacentTile.dataset.isOpen) {
                    handleTileClick(num, getAroundArr(num, row, col), row, col);
                }
            });
        } else {
            // 주변에 지뢰가 있다면 해당 숫자를 표시합니다.
            openTile(tile, mineCount);
        }
    }
}

// 우클릭 처리 함수
function handleRightClick(tile, point) {
    if (tile.dataset.isOpen === "true") return; // 이미 열린 타일은 처리하지 않음

    const hasFlag = tile.classList.contains("flag"); // 깃발 여부 확인

    if (hasFlag) {
        tile.classList.remove("flag"); // 깃발 제거
        tile.classList.add("qmark"); // 물음표 아이콘 추가
        tile.innerHTML = "❓"; // 물음표 아이콘 표시
    } else if (tile.classList.contains("qmark")) {
        tile.classList.remove("qmark"); // 물음표 아이콘 제거
        tile.innerHTML = ""; // 아이콘 삭제
        tile.style.backgroundColor = ""; // 배경색 초기화
    } else {
        tile.classList.add("flag"); // 깃발 아이콘 추가
        tile.innerHTML = "🚩"; // 깃발 아이콘 표시
        tile.style.backgroundColor = "rgb(255, 255, 160)"; // 배경색 변경
    }

    checkWin(point);
}

// 타일 열기 함수
function openTile(tile, count) {
    tile.dataset.isOpen = "true";
    tile.style.color = COLORS[count];
    tile.textContent = count || "";
    tile.style.backgroundColor = "rgb(225, 250, 173)";
}

// 타일에 이벤트 리스너 추가 함수
function tileEvent(targetNum, aroundArr, row, col, mines, point) {
    const tile = tdArr[targetNum];
    tile.addEventListener("click", () => {
        handleTileClick(targetNum, aroundArr, row, col, mines, point);
    });

    tile.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        handleRightClick(tile, point);
    });
}

// 게임 종료 처리 함수
function gameOver(point) {
    const elapsedTime = calculateElapsedTime();
    document.querySelector('#game-over').textContent = `Game Over! 게임이 끝났습니다!, 걸린 시간: ${elapsedTime} 초!!!`;
    document.querySelector('#game-point').value = `${point}` + elapsedTime;
    tdArr.forEach((tile, idx) => {
        if (tile.classList.contains("mines")) {
            tile.style.backgroundColor = MINE_COLOR;
            tile.textContent = "X";
        }
    });
}

// 점수 계산 함수
function calculateScore(elapsedTime, point) {
    let baseScore = 1000 - elapsedTime;
    if (baseScore < 0) baseScore = 0;
    const bonusScore = point * 500;

    return baseScore + bonusScore;
}

// 승리 여부 확인 함수
function checkWin(point) {
    const unopenedTiles = tdArr.filter((tile) => !tile.dataset.isOpen && !tile.classList.contains("mines"));
    const unopenedMineTiles = tdArr.filter((tile) => !tile.dataset.isOpen && tile.classList.contains("mines"));

    // 깃발이 표시된 타일 중에서 지뢰가 있는 타일만 필터링
    const correctlyFlagged = tdArr.filter((tile) => tile.classList.contains("flag") && tile.classList.contains("mines")).length;
    const mines = tdArr.filter((tile) => tile.classList.contains("mines")).length;

    if (unopenedTiles.length === 1 && unopenedMineTiles.length === 1) {
        const lastTile = unopenedMineTiles[0];
        lastTile.classList.add("flag");
        lastTile.innerHTML = "🚩";
        lastTile.style.backgroundColor = "rgb(255, 255, 160)";
    }

    if ((correctlyFlagged === mines && correctlyFlagged === tdArr.filter(tile => tile.classList.contains("flag")).length)) {
        const elapsedTime = calculateElapsedTime();
        const score = calculateScore(elapsedTime, point);
        document.querySelector('#game-win').textContent = `You Win! 걸린 시간: ${elapsedTime} 초 !!! 점수: ${score}점`;
        document.querySelector('#game-point').value = `${point}` + elapsedTime;
    }
}

// 경과 시간 계산 함수
function calculateElapsedTime() {
    const currentTime = new Date();
    const elapsedTime = (currentTime - startTime) / 1000;
    return Math.round(elapsedTime);
}

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
