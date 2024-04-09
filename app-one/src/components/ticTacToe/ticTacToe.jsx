import React, { useState } from 'react';

import './ticTacToe.css';

const TicTacToe = () => {

    const [state, setState] = useState([[11,12,13],[21,22,23],[31,32,33]])
    const [player, setPlayer] = useState('X')
    const [winner, setWinner] = useState()

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
                if (state[0][col] === state[1][col] && state[1][col] === state[2][col]) {
                    setWinner(state[0][col]);
                }
            }
    
            setPlayer(player === 'X' ? 'O' : 'X');
            console.table(state);
        }
    };
    


    return ( 
        <div className="main_container">
            <div className="messageBox">
                {winner && <h2>{`Winner is ${winner}`}</h2>}
            </div>
            <div className="tictactoe_boxes">
                {state.map(row => row.map(box => <div 
                    className="tictactoe_box" 
                    key={Math.random(8)} 
                    onClick={() => boxSelectHandler(row, box)}>
                        {isNaN(box) && box}
                    </div>))}
            </div>
        </div>
     );
}
 
export default TicTacToe;