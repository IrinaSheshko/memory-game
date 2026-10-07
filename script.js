// Game state variables
let firstCard = null;
let secondCard = null;
let isBoardLocked = false;
let moves = 0;
let matchedPairs = 0;
let flipTimer = null;

// DOM Helpers
function createElement(tagName, className, text) { 
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
}

// Header DOM
const header = createElement('header', 'header');
const title = createElement('h1', 'game-title', 'Memory Game');
const newGameBtn = createElement('button', 'btn', 'New Game');
const leaderboardBtn = createElement('button', 'btn', 'Leaderboard');
header.append(title, newGameBtn, leaderboardBtn);
document.body.append(header);

// Info Panel & Board DOM
const infoPanel = createElement('div', 'info-panel');
const gameBoard = createElement('div', 'game-board');
const movesCounter = createElement('div', 'moves-counter', 'Moves: 0');
const pairsCounter = createElement('div', 'pairs-counter', 'Pairs: 0 / 8');

infoPanel.append(movesCounter, pairsCounter);
document.body.append(infoPanel, gameBoard);

// Update Counters
function updateCounters() {
    movesCounter.textContent = `Moves: ${moves}`;
    pairsCounter.textContent = `Pairs: ${matchedPairs} / 8`;
}

// Cards Data & Shuffle
const animals = [
    'images/icons-1.png',
    'images/icons-2.png',
    'images/icons-3.png',
    'images/icons-4.png',
    'images/icons-5.png',
    'images/icons-6.png',
    'images/icons-7.png',
    'images/icons-8.png',
];
const cardsData = animals.concat(animals);

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// Unified Board Initialization (заменяет дублирование в createCards и restartGame)
function restartGame() {
    if (flipTimer) {
        clearTimeout(flipTimer);
        flipTimer = null;
    }

    firstCard = null;
    secondCard = null;
    isBoardLocked = false;
    moves = 0;
    matchedPairs = 0;
    updateCounters();

    gameBoard.textContent = '';
    const shuffledCards = shuffle(cardsData);

    shuffledCards.forEach((imgSrc) => {
        const card = createElement('div', 'card');
        const cardContent = createElement('img', 'card-content');
        cardContent.src = imgSrc;

        card.append(cardContent);
        gameBoard.append(card);

        card.addEventListener('click', () => handleCardClick(card));
    });
}

newGameBtn.addEventListener('click', restartGame);

// Handle Card Clicks
function handleCardClick(card) {
    if (isBoardLocked || card.classList.contains('open') || card === firstCard) {
        return;
    }
    card.classList.add('open');

    if (!firstCard) {
        firstCard = card;
    } else {
        secondCard = card;    
        moves++;
        updateCounters();

        const firstImg = firstCard.querySelector('img').src;
        const secondImg = secondCard.querySelector('img').src;

        if (firstImg === secondImg) {
            matchedPairs++;
            updateCounters();
            checkWin();
            firstCard = null;
            secondCard = null;
        } else {
            isBoardLocked = true;
            const img1 = firstCard;
            const img2 = secondCard;

            firstCard = null;
            secondCard = null;

            flipTimer = setTimeout(() => {
                img1.classList.remove('open');
                img2.classList.remove('open');
                isBoardLocked = false;
            }, 1000);
        }
    }       
}

// Check Win Condition
function checkWin() {
    if (matchedPairs === 8) {
        saveScore(moves);

        setTimeout(() => {
            const winContainer = createElement('div', 'win-modal');
            const winTitle = createElement('h2', 'win-title', 'Поздравляем!');
            const winMessage = createElement('p', 'win-message', `Вы прошли игру за ${moves} ходов!`);
            const winRestartBtn = createElement('button', 'btn', 'Новая игра');

            winRestartBtn.addEventListener('click', () => {
                closeModal();
                restartGame();
            });

            winContainer.append(winTitle, winMessage, winRestartBtn);
            openModal(winContainer);
        }, 300);
    }
}

// Modal System
const modal = createElement('dialog', 'modal');
const modalContent = createElement('div', 'modal-content');
const modalCloseBtn = createElement('button', 'modal-close-btn', '✕');
modalCloseBtn.setAttribute('aria-label', 'Закрыть'); // Добавили aria-label для доступности

modal.append(modalCloseBtn, modalContent);
document.body.append(modal);

function openModal(contentElement) {
    modalContent.replaceChildren(contentElement);
    document.body.classList.add('modal-open');
    modal.showModal(); 
}

function closeModal() {
    modal.close();
    document.body.classList.remove('modal-open');
}

modalCloseBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (event) => {
    const rect = modal.getBoundingClientRect();
    const isClickInside = 
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

    if (!isClickInside) {
        closeModal();
    }
});

modal.addEventListener('cancel', () => {
    document.body.classList.remove('modal-open');
});

// Safe LocalStorage Reader Helper
function getStoredScores() {
    try {
        const data = localStorage.getItem('memoryGameScores');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Ошибка чтения из localStorage:', e);
        return [];
    }
}

// Leaderboard
function showLeaderboard() {
    const scores = getStoredScores();

    const container = createElement('div', 'leaderboard-modal');
    const title = createElement('h2', 'leaderboard-title', 'Таблица лидеров');
    container.append(title);

    if (scores.length === 0) {
        const emptyMsg = createElement('p', 'empty-msg', 'Пока нет результатов');
        container.append(emptyMsg);
    } else {
        const table = createElement('table', 'leaderboard-table');
        const thead = createElement('thead');
        const headerRow = createElement('tr'); 

        const headers = ['№', 'Ходы', 'Дата'];
        headers.forEach(text => {
            const th = createElement('th', '', text);
            headerRow.append(th);
        }); 
        thead.append(headerRow); // Исправлено: вставляем headerRow в thead
      
        const tbody = createElement('tbody');
        scores.forEach((score, index) => {
            const tr = createElement('tr');
            
            const tdRank = createElement('td', '', String(index + 1));
            const tdMoves = createElement('td', '', String(score.moves));
            const tdDate = createElement('td', '', score.date);

            tr.append(tdRank, tdMoves, tdDate);
            tbody.append(tr);
        });

        table.append(thead, tbody);
        container.append(table);
    }

    const closeBtn = createElement('button', 'btn modal-close-action-btn', 'Закрыть');
    closeBtn.addEventListener('click', closeModal);
    container.append(closeBtn);

    openModal(container);
}

leaderboardBtn.addEventListener('click', showLeaderboard);

// Save Score to LocalStorage
function saveScore(movesCount) {
    const scores = getStoredScores();
    
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;

    const newScore = {
        moves: movesCount,
        date: formattedDate,
        timestamp: Date.now() 
    };

    scores.push(newScore);
    
    scores.sort((a, b) => {
        if (a.moves !== b.moves) {
            return a.moves - b.moves;
        }
        return a.timestamp - b.timestamp;
    });

    const topScores = scores.slice(0, 10);
    
    try {
        localStorage.setItem('memoryGameScores', JSON.stringify(topScores));
    } catch (e) {
        console.error('Ошибка записи в localStorage:', e);
    }
}

// Initial Game Start
restartGame();