import React, { useMemo, useState } from 'react';
import { useSpring, animated } from '@react-spring/web'



import ResetGame from '../utils/resetGame';
import UpdateGame from '../utils/updateGame';

import './ticTacToe.css';




const TicTacToe = () => {
    const [state, setState] = useState([]);
    const [winner, setWinner] = useState();
    const [markClass, setMarkClass] = useState();
    const [player, setPlayer] = useState();
    const [scoreBoard, setScoreBoard] = useState({ PlayerX: 0, PlayerO: 0 });

    // const springs = useSpring({
    //     from: { y: 1000 },
    //     to: { y: 0 },
    // })
    const [springs, api] = useSpring(() => ({
        from: { 
            opacity: 0,
        },
        
      }))


    useMemo(() => {
        if (state.length === 0) {
            return;
        }

        const status = state.map(row => row.filter(item => !isNaN(item))).map(rowStatus => rowStatus.length < 1);
        status.every(item => item === true) && !winner && setWinner('no one, sorry :)');
    }, [state, winner]);


    const startGameHandler = () => {
        ResetGame({ setState, setPlayer, winner, setWinner, setMarkClass })
        api.start({
            from: {
             opacity: 0,
            },
            to: {
             opacity: 1,
            },
          })
    };


    const UpdateBoardHandler = (row, box) => {
        const rowIndex = state.indexOf(row);
        const boxIndex = row.indexOf(box);
        UpdateGame({ rowIndex, boxIndex, state, setState, setPlayer, setWinner, setMarkClass, player, setScoreBoard });
    };



    return (
        <div className="main_container">
            {state && state.length === 0 && (
                <div>
                    <h4>START THE GAME</h4>
                    <button onClick={startGameHandler}>Click to start</button>
                </div>
            )}

            {state.length > 0 && (
                <animated.div style={{...springs}}>
                    {winner && (
                        <div className="messageBox">
                            <h2>{`Winner is ${winner}`}</h2>
                            <button onClick={startGameHandler}>RESET</button>
                        </div>
                    )}

                    <div div className="tictactoe_boxes">
                        {markClass && <div className={`markLine ${markClass}`} />}
                        {state.map(row =>
                            row.map((box, index) => (
                                <div
                                    className="tictactoe_box"
                                    key={index}
                                    onClick={() => UpdateBoardHandler(row, box)}>
                                    {isNaN(box) && box}
                                </div>
                            ))
                        )}

                        {!winner && (
                            <div className="playerName">
                                <p>{`Player ${player}'s turn`}</p>
                            </div>
                        )}

                        <div className="scoreBoard">
                            <p>{`Player X: ${scoreBoard.PlayerX} - Player O: ${scoreBoard.PlayerO}`}</p>
                        </div>
                    </div>
                </animated.div>
            )}
        </div>
    );
};

 
export default TicTacToe;