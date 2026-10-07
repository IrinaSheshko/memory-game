// Game state variables
let firstCard = null;
let secondCard = null;
let isBoardLocked = false;
let moves = 0;
let matchedPairs = 0;
let flipTimer = null;

// update counters start
function updateCounters() {
    movesCounter.textContent = `Moves: ${moves}`;
    pairsCounter.textContent = `Pairs: ${matchedPairs} / 8`;
}
// update counters end


// Create DOM helper
function createElement(tagName, className, text){ 

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

// Check win start
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
// Check win end

// HandleCardClick(card) start
function handleCardClick(card) {
    if (isBoardLocked || card.classList.contains('open') || card === firstCard) {
        return;
    }
    card.classList.add('open');

    if (!firstCard){
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

// HandleCardClick(card) end

// Create moves
const infoPanel = createElement('div', 'info-panel');
const gameBoard = createElement('div', 'game-board');
const movesCounter = createElement('div', 'moves-counter', 'Moves: 0');
const pairsCounter = createElement('div', 'pairs-counter', 'Pairs: 0 / 8');

infoPanel.append(movesCounter, pairsCounter);
document.body.append(infoPanel, gameBoard);


// Create massiv start
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
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
}
    return array;
}
// Create massiv end

// Create cards start
const shuffledCards = shuffle(cardsData);

function createCards() {
    gameBoard.textContent = '';
    for (let i = 0; i < 16; i++) {
        const card = createElement('div', 'card');
        const cardContent = createElement('img', 'card-content');
        cardContent.src = shuffledCards[i];

        card.append(cardContent);
        gameBoard.append(card);

        card.addEventListener('click', () => handleCardClick(card));
    }
}
createCards();
updateCounters();
// Create cards end


// Restare game start
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
    
    const newShuffled = shuffle([...cardsData]);

    gameBoard.textContent = '';
    for (let i = 0; i < 16; i++) {
        const card = createElement('div', 'card');
        const cardContent = createElement('img', 'card-content');
        cardContent.src = newShuffled[i];

        card.append(cardContent);
        gameBoard.append(card);

        card.addEventListener('click', () => handleCardClick(card));
    }
}

newGameBtn.addEventListener('click', restartGame);
// Restare game end


// Modal System Start 
const modal = createElement('dialog', 'modal');
const modalContent = createElement('div', 'modal-content');
const modalCloseBtn = createElement('button', 'modal-close-btn', '✕');

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

// Close x
modalCloseBtn.addEventListener('click', closeModal);

// Close Backdrop
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

// Close
modal.addEventListener('cancel', () => {
    document.body.classList.remove('modal-open');
});
// Modal System End 

// Leaderboard start
function showLeaderboard() {
    const scores = JSON.parse(localStorage.getItem('memoryGameScores')) || [];

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
// Leaderboard end

//Save LocalStorage start
function saveScore(movesCount) {
    const scores = JSON.parse(localStorage.getItem('memoryGameScores')) || [];
    
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
    
    localStorage.setItem('memoryGameScores', JSON.stringify(topScores));
}