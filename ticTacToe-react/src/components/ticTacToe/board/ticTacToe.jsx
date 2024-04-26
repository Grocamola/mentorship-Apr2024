import React, { useEffect, useState } from 'react';

import StartGame from '../utils/startGame';
import ResetGame from '../utils/resetGame';
import UpdateGame from '../utils/updateGame';

import './ticTacToe.css';




const TicTacToe = () => {

    const [state, setState] = useState([])
    const [player, setPlayer] = useState("X")
    const [winner, setWinner] = useState()
    const [markClass, setMarkClass] = useState()
    const [scoreBoard, setScoreBoard] = useState({PlayerX: 0, PlayerO: 0})
    



    // ------------------ SHOULD CHANGE ------------------ 
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

    // ------------------ SHOULD CHANGE ------------------ 
    useEffect(() => {
        const status = state.map(row => row.filter(item => !isNaN(item))).map(rowStatus => rowStatus.length < 1)
        status.every(item => item === true) && !winner && setWinner('no one, sorry :)')
    },[state, winner])

    const UpdateBoardHandler = (row, box) => { 
        console.log(row, box, player)
        UpdateGame({row, box, winner, setState, setPlayer, player})
    }
    


    return ( 
        <div className="main_container">

            {state.length === 0 && <div>
                <h4>START THE GAME</h4>
                <button onClick={() => StartGame({ setState, setPlayer, winner, setWinner, setMarkClass })}>Click to start</button>
            </div>}

            {state.length > 0 ?
            <>
                {winner && <div className="messageBox">
                    <h2>{`Winner is ${winner}`}</h2>
                    <button onClick={() => ResetGame({ setState, setPlayer, winner, setWinner, setMarkClass })}>RESET</button>
                </div>}
                
                <div className="tictactoe_boxes">

                    {markClass && <div className={`markLine ${markClass}`} />}

                    {state.map(row => row.map(box => <div 
                        className="tictactoe_box" 
                        key={Math.random(8)} 
                        onClick={() => UpdateBoardHandler(row, box)}>
                            {isNaN(box) && box}
                        </div>))}

                    {!winner && <div className="playerName">
                        <p>{`Player ${player}'s turn`}</p>
                    </div>}

                    <div className="scoreBoard">
                        <p>{`Player X: ${scoreBoard.PlayerX} - Player O: ${scoreBoard.PlayerO}`}</p>
                    </div>

                </div>
            </> : null }
        </div>
     );
}
 
export default TicTacToe;