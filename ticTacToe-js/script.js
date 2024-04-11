const gameBoard = document.getElementById('gameBoard');
const resetButton = document.getElementById('resetButton');
let winnerMessage = document.getElementById('WinnersName');
let scoreBoardMessage = document.getElementById('scoreBoard');
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let scoreBoard = [];
let gameActive = true;

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function initializeGame() {
    gameBoard.innerHTML = '';
    winnerMessage.innerHTML = `Player ${currentPlayer}'s turn`
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('game-cell');
        cell.addEventListener('click', () => cellClicked(i));
        gameBoard.appendChild(cell);
    }
}

function cellClicked(index) {
    if (board[index] !== '') {
        console.log('Choose another cell, this one is taken ;)')
        return;
    } else if (!gameActive) {
        return;
    }

    board[index] = currentPlayer;
    updateBoard();

    if (checkWin()) {
        scoreBoard.push(currentPlayer)
        console.log(`${currentPlayer} won.`);
        winnerMessage.innerHTML = `${currentPlayer} wins!`
        scoreBoardMessage.innerHTML = `Player X: ${scoreBoard.filter(player => player === 'X').length} - Player O: ${scoreBoard.filter(player => player === 'O').length}`
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        console.log("It's a draw!");
        winnerMessage.innerHTML = "It's a draw!"
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function updateBoard() {
    board.forEach((symbol, index) => {
        gameBoard.children[index].textContent = symbol;
    });
}

function checkWin() {
    return winConditions.some(condition => {
        return condition.every(index => board[index] === currentPlayer);
    });
}

function checkDraw() {
    return board.every(cell => cell !== '');
}

resetButton.addEventListener('click', () => {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = scoreBoard.length > 0 ? scoreBoard[scoreBoard.length - 1] : "X";
    gameActive = true;
    initializeGame();
    winnerMessage.innerHTML = `Player ${currentPlayer}'s turn`
});

initializeGame();
