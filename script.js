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
const movesCounter = createElement('div', 'moves-counter', 'Moves: 0');
const pairsCounter = createElement('div', 'pairs-counter', 'Pairs: 0 / 8');

infoPanel.append(movesCounter, pairsCounter);

const gameBoard = createElement('div', 'game-board');

document.body.append(infoPanel, gameBoard);