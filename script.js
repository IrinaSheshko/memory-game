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
    }
}
createCards();
// Create cards end