const boardEl = document.getElementById('chess-board');
const statusEl = document.getElementById('status');

// Обозначения фигур (Unicode)
const PIECES = {
    white: { p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔' },
    black: { p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚' }
};

let board = [];
let selectedCell = null;
let turn = 'white';
let possibleMoves = [];

// 1. Инициализация доски данными
function initBoardArray() {
    const layout = [
        ['r','n','b','q','k','b','n','r'],
        ['p','p','p','p','p','p','p','p'],
        Array(8).fill(null), Array(8).fill(null), Array(8).fill(null), Array(8).fill(null),
        ['p','p','p','p','p','p','p','p'],
        ['r','n','b','q','k','b','n','r']
    ];
    
    return layout.map((row, rIdx) => row.map((type, cIdx) => {
        if (!type) return null;
        return { type, color: rIdx < 2 ? 'black' : 'white' };
    }));
}

board = initBoardArray();

// 2. Отрисовка доски
function render() {
    boardEl.innerHTML = "";
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const cell = document.createElement('div');
            cell.className = `cell ${(r + c) % 2 === 0 ? 'white' : 'black'}`;
            cell.dataset.row = r;
            cell.dataset.col = c;

            const piece = board[r][c];
            if (piece) {
                cell.textContent = PIECES[piece.color][piece.type];
                cell.classList.add(piece.color === 'white' ? 'white-p' : 'black-p');
            }

            // Подсветка выбранной клетки и возможных ходов
            if (selectedCell && selectedCell.r === r && selectedCell.c === c) cell.classList.add('selected');
            if (possibleMoves.some(m => m.r === r && m.c === c)) cell.classList.add('possible');

            cell.onclick = () => handleCellClick(r, c);
            boardEl.appendChild(cell);
        }
    }
}

// 3. Логика клика
function handleCellClick(r, c) {
    const piece = board[r][c];

    // Если нажали на возможный ход — ходим
    const move = possibleMoves.find(m => m.r === r && m.c === c);
    if (move) {
        executeMove(r, c);
        return;
    }

    // Выбор фигуры своего цвета
    if (piece && piece.color === turn) {
        selectedCell = { r, c };
        possibleMoves = getValidMoves(r, c);
    } else {
        selectedCell = null;
        possibleMoves = [];
    }
    render();
}

// 4. Правила ходов (упрощенно для примера: Ладья, Слон, Ферзь, Король, Пешка)
function getValidMoves(r, c) {
    const piece = board[r][c];
    const moves = [];
    const dirs = {
        'r': [[0,1],[0,-1],[1,0],[-1,0]],
        'b': [[1,1],[1,-1],[-1,1],[-1,-1]],
        'q': [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]],
        'k': [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]],
        'n': [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]]
    };

    if (piece.type === 'p') {
        const d = piece.color === 'white' ? -1 : 1;
        const start = piece.color === 'white' ? 6 : 1;
        if (!board[r+d]?.[c]) {
            moves.push({r: r+d, c});
            if (r === start && !board[r+d*2]?.[c]) moves.push({r: r+d*2, c});
        }
        [[d, 1], [d, -1]].forEach(off => {
            const t = board[r+off[0]]?.[c+off[1]];
            if (t && t.color !== piece.color) moves.push({r: r+off[0], c: c+off[1]});
        });
    } else if (dirs[piece.type]) {
        dirs[piece.type].forEach(d => {
            let nr = r + d[0], nc = c + d[1];
            while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                const t = board[nr][nc];
                if (!t) {
                    moves.push({r: nr, c: nc});
                    if (piece.type === 'k' || piece.type === 'n') break;
                } else {
                    if (t.color !== piece.color) moves.push({r: nr, c: nc});
                    break;
                }
                nr += d[0]; nc += d[1];
            }
        });
    }
    return moves;
}

// 5. Выполнение хода
function executeMove(r, c) {
    const targetPiece = board[r][c];
    
    // Если съели короля
    if (targetPiece?.type === 'k') {
        alert(`Шах и мат! Победили ${turn === 'white' ? 'Белые' : 'Черные'}`);
        location.reload();
        return;
    }

    board[r][c] = board[selectedCell.r][selectedCell.c];
    board[selectedCell.r][selectedCell.c] = null;
    
    turn = turn === 'white' ? 'black' : 'white';
    statusEl.textContent = `Ход: ${turn === 'white' ? 'Белые' : 'Черные'}`;
    selectedCell = null;
    possibleMoves = [];
    render();
}

render();