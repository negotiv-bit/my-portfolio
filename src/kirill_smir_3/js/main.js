// === 1. РЕАКЦИЯ ===
let rCount = 0, rTime = 30, rInterval, rStart;
const target = document.getElementById('target');

document.getElementById('start-react').onclick = () => {
    rCount = 0; rTime = 30;
    document.getElementById('react-count').textContent = "0";
    rInterval = setInterval(() => {
        rTime--; document.getElementById('react-timer').textContent = rTime;
        if (rTime <= 0) { clearInterval(rInterval); target.style.display = 'none'; alert("Ваш результат: " + rCount); }
    }, 1000);
    moveTarget();
};

function moveTarget() {
    if (rTime <= 0) return;
    setTimeout(() => {
        const area = document.getElementById('area');
        target.style.left = Math.random() * (area.clientWidth - 80) + "px";
        target.style.top = Math.random() * (area.clientHeight - 40) + "px";
        target.style.display = "block";
        rStart = Date.now();
    }, Math.random() * 4000 + 0); // Интервал 1-5 сек 
}

target.onclick = () => {
    rCount++; document.getElementById('react-count').textContent = rCount;
    target.style.display = "none";
    moveTarget();
};

// === 2. КРЕСТИКИ-НОЛИКИ ===
let board = Array(9).fill(""), p = "X", winsX = 0, winsO = 0;
const cells = document.querySelectorAll('.cell'), status = document.getElementById('ttt-status');

cells.forEach(c => c.onclick = () => {
    let i = c.dataset.i;
    if (board[i] || status.textContent.includes("победил")) return;
    makeMove(i, p);
    if (!checkWin(p)) {
        p = p === "X" ? "O" : "X";
        status.textContent = "Ход " + p;
        if (document.getElementById('ai-mode').checked && p === "O") setTimeout(aiMove, 500);
    }
});

function makeMove(i, player) {
    board[i] = player; cells[i].textContent = player;
    if (checkWin(player)) {
        status.textContent = "Игрок " + player + " победил!";
        player === "X" ? winsX++ : winsO++;
        document.getElementById('wins-x').textContent = winsX;
        document.getElementById('wins-o').textContent = winsO;
    }
}

function checkWin(pl) {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return lines.some(l => l.every(idx => board[idx] === pl));
}

function aiMove() {
    let empty = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    if (empty.length > 0) cells[empty[Math.floor(Math.random() * empty.length)]].click();
}

document.getElementById('ttt-new').onclick = () => {
    board.fill(""); cells.forEach(c => c.textContent = "");
    p = "X"; status.textContent = "Ход X";
};

// === 3. ЛАБИРИНТ ===
const mazeMap = [
    1,1,1,1,1,1,1,1,1,1,
    0,0,0,1,0,0,0,0,0,1,
    1,1,0,1,0,1,1,1,0,1,
    1,0,0,0,0,0,0,1,0,1,
    1,0,1,1,1,1,0,1,0,1,
    1,0,0,0,1,0,0,0,0,1,
    1,1,1,0,1,0,1,1,1,1,
    1,0,0,0,0,0,0,0,0,1,
    1,0,1,1,1,1,1,1,0,2,
    1,1,1,1,1,1,1,1,1,1
]; // 0-путь, 1-стена, 2-выход

let pos = 10, mazeTime = 0, mazeInt;
const mazeBox = document.getElementById('maze-container');

function drawMaze() {
    mazeBox.innerHTML = "";
    mazeMap.forEach((tile, i) => {
        const d = document.createElement('div');
        d.className = tile === 1 ? "wall" : tile === 2 ? "exit" : "path";
        if (i === pos) d.classList.add("player");
        mazeBox.appendChild(d);
    });
}

window.onkeydown = (e) => {
    let next = pos;
    if (e.key === "ArrowUp") next -= 10;
    if (e.key === "ArrowDown") next += 10;
    if (e.key === "ArrowLeft") next -= 1;
    if (e.key === "ArrowRight") next += 1;
    
    if (mazeMap[next] !== 1 && next >= 0 && next < 100) {
        pos = next; drawMaze();
        if (mazeMap[pos] === 2) { clearInterval(mazeInt); alert("Победа!"); }
    }
};

drawMaze();
mazeInt = setInterval(() => { mazeTime++; document.getElementById('maze-timer').textContent = mazeTime; }, 1000);
document.getElementById('maze-start').onclick = () => { pos = 10; mazeTime = 0; drawMaze(); };