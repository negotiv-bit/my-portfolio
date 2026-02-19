
let count = 0;
let timeLeft = 30;
let timer = null;
let record = localStorage.getItem('clickerRecord') || 0;

const counterEl = document.getElementById('counter');
const timeEl = document.getElementById('time');
const recordEl = document.getElementById('record');
const startBtn = document.getElementById('start-btn');

recordEl.textContent = record;

startBtn.addEventListener('click', () => {
    if (!timer) startTimer();
    count++;
    counterEl.textContent = count;
    startBtn.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
});

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timeEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            startBtn.disabled = true;
            alert(`Игра окончена! Счёт: ${count}`);
            if (count > record) {
                record = count;
                localStorage.setItem('clickerRecord', record);
                recordEl.textContent = record;
            }
        }
    }, 1000);
}

// === ИГРА 2: ГЕНЕРАТОР (Добавляем вывод истории и сохранение списка) ===
const heroes = ['Рыцарь', 'Маг', 'Вор', 'Лучник'];
const locations = ['тёмном лесу', 'заброшенном замке', 'подводном царстве', 'пустыне'];
const villains = ['драконом', 'колдуном', 'гоблином', 'гигантским пауком'];

const historyEl = document.getElementById('history');
// Загружаем массив историй из localStorage или создаем пустой
let adventureHistory = JSON.parse(localStorage.getItem('adventureHistory')) || [];

// Функция для отрисовки истории на экране
function renderHistory() {
    historyEl.innerHTML = '<h4>История приключений:</h4>';
    adventureHistory.forEach(item => {
        const p = document.createElement('p');
        p.style.fontSize = '12px';
        p.style.borderBottom = '1px solid #eee';
        p.textContent = item;
        historyEl.appendChild(p);
    });
}
renderHistory(); // Показываем историю сразу при загрузке

document.getElementById('gen-btn').addEventListener('click', () => {
    const hero = heroes[Math.floor(Math.random() * heroes.length)];
    const loc = locations[Math.floor(Math.random() * locations.length)];
    const vill = villains[Math.floor(Math.random() * villains.length)];

    const story = `Персонаж ${hero} в ${loc} против ${vill}.`;
    document.getElementById('adventure-text').textContent = story;

    // Добавляем в массив и сохраняем
    adventureHistory.push(story);
    if(adventureHistory.length > 5) adventureHistory.shift(); // Храним только последние 5
    localStorage.setItem('adventureHistory', JSON.stringify(adventureHistory));
    renderHistory();
});

// === ИГРА 3: УГАДАЙ ЧИСЛО (Добавляем сохранение лучшего результата) ===
let targetNumber = Math.floor(Math.random() * 100) + 1;
let attemptsUsed = 0;
const maxAttempts = 10;
// Рекорд здесь — это минимальное количество попыток, за которое угадали
let guessRecord = localStorage.getItem('guessRecord') || "--";

const guessInput = document.getElementById('guess-input');
const guessBtn = document.getElementById('guess-btn');
const guessMsg = document.getElementById('guess-message');
const attemptsEl = document.getElementById('attempts-left');

// Создадим элемент для рекорда в HTML динамически
const guessStats = document.querySelector('#guesser .stats');
const recordDisplay = document.createElement('p');
recordDisplay.innerHTML = `Лучший результат: <span id="guess-record">${guessRecord}</span> поп.`;
guessStats.appendChild(recordDisplay);

guessBtn.addEventListener('click', () => {
    const userGuess = parseInt(guessInput.value);
    attemptsUsed++;
    let remaining = maxAttempts - attemptsUsed;
    attemptsEl.textContent = remaining;

    if (userGuess === targetNumber) {
        guessMsg.textContent = " Угадали!";
        if (guessRecord === "--" || attemptsUsed < guessRecord) {
            localStorage.setItem('guessRecord', attemptsUsed);
            document.getElementById('guess-record').textContent = attemptsUsed;
        }
        endGuessGame();
    } else if (remaining <= 0) {
        guessMsg.textContent = `Проиграли! Было: ${targetNumber}`;
        endGuessGame();
    } else {
        guessMsg.textContent = userGuess > targetNumber ? "Меньше!" : "Больше!";
    }
    guessInput.value = '';
});

function endGuessGame() {
    guessBtn.disabled = true;
    document.getElementById('restart-guess').style.display = 'inline-block';
}

document.getElementById('restart-guess').addEventListener('click', () => {
    location.reload();
});