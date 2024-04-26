const express = require('express');
const cors = require('cors');


const app = express();

app.use(express.json());
app.use(cors());

let board = [[11,12,13],[21,22,23],[31,32,33]];
let winner = '';


// Function to check if there's a winner
function checkWinner(board) {

    // // Check for a winner in columns
    // for (let i = 0; i < board.length; i++) {
    //     if(board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
    //       setWinner(board[0][col]);
    //       setMarkClass(col === 0 ? 'col-left' : col === 1 ? 'col-center' : 'col-right');
    //     }
    // }
    // // Check for a winner in rows
    // for (let i = 0; i < board.length; i++) {
    //     if(board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
    //       setWinner(board[row][0]);
    //       setMarkClass(row === 0 ? 'row-up' : row === 1 ? 'row-center' : 'row-down');
    //     } 
    // }
    // // Check X
    // if(board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    //    setWinner(board[0][0]);
    //    setMarkClass('diagonal-left')
    // } 
    // if(board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    //   setWinner(board[0][2])
    //   setMarkClass('diagonal-right')
    // } 
    return "X"
}



app.get('/board', (req, res) => { 
    res.json({ board, winner });
})



// POST endpoint to make a move
app.post('/move', (req, res) => {
    const { x, y, player } = req.body;

    // Update the board with the move
    if(board[x][y] === "X" || board[x][y] === "Y") { 
        throw new Error('Clicked on a taken cell.')
    }

    board[x][y] = player;

    // Check if there's a winner
    winner = checkWinner(board);

    // Return the updated board and winner status
    res.json({ board, winner });
});



// DELETE endpoint to clear and reset the board
app.delete('/reset', (req, res) => {
    board = [[11,12,13],[21,22,23],[31,32,33]];    
    res.send(board);
});





const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
