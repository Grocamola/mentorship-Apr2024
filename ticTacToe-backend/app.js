const express = require('express');
const cors = require('cors');


const app = express();

app.use(express.json());
app.use(cors());

let board = [[11,12,13],[21,22,23],[31,32,33]];
let winner = '';
let winnerClass = '';


function checkWinner(board) {

    // Check for a winner in columns
    for (let col = 0; col < board.length; col++) {
        if(board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
          winner = board[0][col];
          winnerClass = col === 0 ? 'col-left' : col === 1 ? 'col-center' : 'col-right';
        }
    }
    // Check for a winner in rows
    for (let row = 0; row < board.length; row++) {
        if(board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
          winner = board[row][0];
          winnerClass = row === 0 ? 'row-up' : row === 1 ? 'row-center' : 'row-down';
        } 
    }
    // Check X
    if(board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
       winner = board[0][0];
       winnerClass = 'diagonal-left';
    } 
    if(board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      winner = board[0][2]
      winnerClass = 'diagonal-right';
    } 
    
    return
}



// POST endpoint to make a move
app.post('/move', (req, res) => {
    const { x, y, player } = req.body;

    if (x === undefined || y === undefined || player === undefined) {
        return res.status(400).json({ error: 'Invalid move data' });
    }

    board[x][y] = player;

    checkWinner(board);

    res.json({ board, winner, winnerClass });
});

// Syatem plays
app.post('/system-move', (req, res) => {
    const { player } = req.body;

    let criticalBox = []

    //System checks if there are any boxes to win with one move
    for (let firstInRow = 0; firstInRow < board.length; firstInRow++) {
        let rowValues = [board[firstInRow][0], board[firstInRow][1], board[firstInRow][2]];
        if(rowValues.filter(item => item === player).length === 2 && rowValues.filter(item => typeof(item) === 'number')){
            if(typeof(board[firstInRow][0]) === 'number') {criticalBox = [firstInRow, 0]}
            else if(typeof(board[firstInRow][1]) === 'number') {criticalBox = [firstInRow, 1]}
            else if(typeof(board[firstInRow][2]) === 'number') {criticalBox = [firstInRow, 2]}
        }
    }
    for (let firstInRCol = 0; firstInRCol < board.length; firstInRCol++) {
        let rowValues = [board[0][firstInRCol], board[1][firstInRCol], board[2][firstInRCol]];
        if(rowValues.filter(item => item === player).length === 2 && rowValues.filter(item => typeof(item) === 'number')){
            if(typeof(board[0][firstInRCol]) === 'number') {criticalBox = [0, firstInRCol]}
            else if(typeof(board[1][firstInRCol]) === 'number') {criticalBox = [1, firstInRCol]}
            else if(typeof(board[2][firstInRCol]) === 'number') {criticalBox = [2, firstInRCol]}
        }
    }

    // I should add something to check diagonal here, low priority, maybe later.

    // If system can't win in one move, it plays randomly in free boxes
    if(board[0][0] === player && board[0][1] === player && board[0][2] !== player && board[0][2] !== "X") {
        criticalBox = [0, 2]
    } else{
        while (criticalBox.length < 1) { 
            let randomRow =  Math.floor(Math.random() * 3);
            let randomCol =  Math.floor(Math.random() * 3);
            if(board[randomRow][randomCol] !== "X" && board[randomRow][randomCol] !== "O" && !isNaN(board[randomRow][randomCol])){
                criticalBox = [randomRow, randomCol]
            } 
        }
    }

    //Sending back result
    if(criticalBox.length > 0) {
        board[criticalBox[0]][criticalBox[1]] = "O"

        checkWinner(board);
        res.json({ board, winner, winnerClass });
        criticalBox = []
    };

    return
})



// DELETE endpoint to clear and reset the board
app.delete('/reset', (req, res) => {
    board = [[11,12,13],[21,22,23],[31,32,33]];
    winner = '';
    winnerClass = '';
    res.send({board, winner, winnerClass});

    return
});





const PORT = process.env.PORT || 4000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
