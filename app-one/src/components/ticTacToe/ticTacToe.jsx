import React, { useEffect, useState } from 'react';

import './ticTacToe.css';

const TicTacToe = () => {

    const [state, setState] = useState([[11,12,13],[21,22,23],[31,32,33]])
    const [player, setPlayer] = useState('X')
    const [winner, setWinner] = useState()
    //better work was to save scoreboard in localStorage, I kept it simple here
    const [scoreBoard, setScoreBoard] = useState({PlayerX: 0, PlayerO: 0})

    const boxSelectHandler = (a, b) => {
        if (!winner) {
            const row = state.findIndex(row => row.includes(b));
            const col = state[row].indexOf(b);
            const tempState = [...state];
    
            if (isNaN(tempState[row][col])) {
                console.log('Sorry, try another box.');
                return;
            }
    
            tempState[row][col] = player;
            setState(tempState);
    
            // Check for a winner in columns
            for (let i = 0; i < state.length; i++) {
                state[0][col] === state[1][col] && state[1][col] === state[2][col] && setWinner(state[0][col]);
            }
            // Check for a winner in rows
            for (let i = 0; i < state.length; i++) {
                state[row][0] === state[row][1] && state[row][1] === state[row][2] && setWinner(state[row][0]);
            }
            // Check X
            state[0][0] === state[1][1] && state[1][1] === state[2][2] && setWinner(state[0][0])
            state[0][2] === state[1][1] && state[1][1] === state[2][0] && setWinner(state[0][2])
    
            setPlayer(player === 'X' ? 'O' : 'X');
            console.table(state);
        }
    };

    // back to empty tic-tac-toe
    const resetHandler = () => { 
        setState([[11, 12, 13], [21, 22, 23], [31, 32, 33]]);
        setPlayer(winner && winner);
        setWinner();
    }

    // I could put this inside the handler, I used useEffect cause it seemed more organize
    useEffect(() => {
        if (winner === 'X') {
            setScoreBoard(prevScore => ({
                ...prevScore,
                PlayerX: prevScore.PlayerX + 1
            }));
        } else if (winner === 'O') {
            setScoreBoard(prevScore => ({
                ...prevScore,
                PlayerO: prevScore.PlayerO + 1
            }));
        }
    },[winner])
    


    return ( 
        <div className="main_container">
            {winner && <div className="messageBox">
                <h2>{`Winner is ${winner}`}</h2>
                <button onClick={resetHandler}>RESET</button>
            </div>}
            
            <div className="tictactoe_boxes">
                
                {state.map(row => row.map(box => <div 
                    className="tictactoe_box" 
                    key={Math.random(8)} 
                    onClick={() => boxSelectHandler(row, box)}>
                        {isNaN(box) && box}
                    </div>))}

                {!winner && <div className="playerName">
                    <p>{`Player ${player}'s turn`}</p>
                </div>}
                <div className="scoreBoard">
                    <p>{`Player X: ${scoreBoard.PlayerX} - Player O: ${scoreBoard.PlayerO}`}</p>
                </div>
            </div>
        </div>
     );
}
 
export default TicTacToe;