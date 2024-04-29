import React, { useMemo, useState } from 'react';
import useMeasure from 'react-use-measure'
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

    const [hover, toggle] = useState(false)
    const [ref, { width }] = useMeasure()
    const props = useSpring({ width: hover ? width : 0 })


    useMemo(() => {
        if (state.length === 0) {
            return;
        }

        const status = state.map(row => row.filter(item => !isNaN(item))).map(rowStatus => rowStatus.length < 1);
        status.every(item => item === true) && !winner && setWinner('no one, sorry :)');
    }, [state, winner]);


    const startGameHandler = () => {
        toggle(true)
        if(winner) { 
            ResetGame({ setState, setPlayer, winner, setWinner, setMarkClass })
        } else { 
           setTimeout(() => ResetGame({ setState, setPlayer, winner, setWinner, setMarkClass }), 1000)  
        }
        
    };


    const UpdateBoardHandler = (row, box) => {

        if(winner !== '') { 
            return
        }
        const rowIndex = state.indexOf(row);
        const boxIndex = row.indexOf(box);
        UpdateGame({ rowIndex, boxIndex, state, setState, setPlayer, setWinner, setMarkClass, player, setScoreBoard });
    };


    return (
        <div className="main_container">
            {state && state.length === 0 && (
                <div>
                    <h4>START THE GAME</h4>
                    <button ref={ref} onClick={startGameHandler} className="main" >
                            <animated.div className='fill' style={props} />
                            <animated.div className='content'>{props.width.to(x => x.toFixed(0))}</animated.div>
                            <p style={{margin: '0 auto', display: width >= 100 ? 'block' : 'none', zIndex: 100}}>START</p>
                    </button>
                </div>
            )}

            {state.length > 0 && (
                <div>
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
                </div>
            )}
        </div>
    );
};

 
export default TicTacToe;