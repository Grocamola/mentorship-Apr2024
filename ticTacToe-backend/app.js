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



app.get('/board', (req, res) => { 
    res.json({ board, winner });
})



// POST endpoint to make a move
app.post('/move', (req, res) => {
    const { x, y, player } = req.body;

    if (x === undefined || y === undefined || player === undefined) {
        return res.status(400).json({ error: 'Invalid move data' });
    }

    // Update the board with the move
    board[x][y] = player;

    // Check if there's a winner
    checkWinner(board);

    res.json({ board, winner, winnerClass });
});



// DELETE endpoint to clear and reset the board
app.delete('/reset', (req, res) => {
    board = [[11,12,13],[21,22,23],[31,32,33]];
    winner = '';
    winnerClass = '';
    res.send({board, winner, winnerClass});
});





const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
