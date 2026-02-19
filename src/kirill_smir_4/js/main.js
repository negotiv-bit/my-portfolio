// === 1. ПОЙМАЙ ПРЕДМЕТ ===
let score = 0, time = 30, gameInterval;
const field = document.getElementById('game-field');

document.getElementById('start-catcher').onclick = () => {
    score = 0; time = 30;
    document.getElementById('score-val').textContent = score;
    gameInterval = setInterval(() => {
        time--; document.getElementById('timer-val').textContent = time;
        if (time <= 0) { clearInterval(gameInterval); alert("Игра окончена! Счёт: " + score); }
        createItem();
    }, 1000);
};

function createItem() {
    const item = document.createElement('div');
    item.className = 'falling-item';
    item.innerHTML = '🍎';
    item.style.left = Math.random() * (field.clientWidth - 40) + 'px';
    item.style.top = '0px';
    field.appendChild(item);

    let top = 0;
    let fall = setInterval(() => {
        top += 5;
        item.style.top = top + 'px';
        if (top > field.clientHeight) { clearInterval(fall); item.remove(); }
    }, 50);

    item.onclick = () => { score++; document.getElementById('score-val').textContent = score; item.remove(); clearInterval(fall); };
}

// === 2. ВИКТОРИНА ===
const questions = [
    { q: "Столица Франции?", a: ["Лондон", "Париж", "Рим"], correct: 1 },
    { q: "2 + 2 * 2 = ?", a: ["8", "4", "6"], correct: 2 }
];
let currentQ = 0;

document.getElementById('start-quiz').onclick = () => { currentQ = 0; showQuestion(); };

function showQuestion() {
    const qBox = document.getElementById('answers-list');
    const qText = document.getElementById('question-text');
    qBox.innerHTML = "";
    qText.textContent = questions[currentQ].q;

    questions[currentQ].a.forEach((ans, i) => {
        const b = document.createElement('button');
        b.className = 'answer-btn';
        b.textContent = ans;
        b.onclick = () => {
            if (i === questions[currentQ].correct) alert("Верно!");
            else alert("Ошибка!");
            currentQ++;
            if (currentQ < questions.length) showQuestion();
            else qText.textContent = "Викторина завершена!";
        };
        qBox.appendChild(b);
    });
}

// === 3. НАЙДИ ПАРУ ===
const icons = ['1','1','2','2','3','3','4','4'];
let openedCards = [];

function initMemory() {
    const grid = document.getElementById('memory-grid');
    grid.innerHTML = "";
    icons.sort(() => Math.random() - 0.5).forEach(icon => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = icon;
        card.onclick = () => {
            if (openedCards.length < 2 && !card.classList.contains('open')) {
                card.classList.add('open');
                openedCards.push(card);
                if (openedCards.length === 2) {
                    if (openedCards[0].innerHTML === openedCards[1].innerHTML) {
                        openedCards = [];
                    } else {
                        setTimeout(() => {
                            openedCards.forEach(c => c.classList.remove('open'));
                            openedCards = [];
                        }, 800);
                    }
                }
            }
        };
        grid.appendChild(card);
    });
}
document.getElementById('restart-memory').onclick = initMemory;
initMemory();