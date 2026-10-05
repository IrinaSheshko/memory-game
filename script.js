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

// Create DOM
function createElement(tagName, className, text){ 

 const element = document.createElement(tagName);
 if (className) element.className = className;
 if (text) element.textContent = text;
 return element;
}

const header = createElement('header', 'header');
const title = createElement('h1', 'game-title', 'Memory Game');
const newGameBtn = createElement('button', 'btn', 'New Game');
const leaderboardBtn = createElement('button', 'btn', 'Leaderboard');
header.append(title, newGameBtn, leaderboardBtn);

document.body.append(header);

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