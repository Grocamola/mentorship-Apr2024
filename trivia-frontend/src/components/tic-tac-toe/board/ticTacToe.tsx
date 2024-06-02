import { useEffect, useMemo, useState } from "react";

// import SignInForm from "../../trivia-utils/requests/signInForm/signInForm";
import ResetGame from "../utils/resetGame";
import UpdateGame from "../utils/updateGame";

import "./ticTacToe.css";
import Navbar from "../../trivia-utils/ui/navbar/navbar";


export type TicTacToeBoard = number[][];


const TicTacToe = () => {

  const [state, setState] = useState<TicTacToeBoard>([]);
  const [winner, setWinner] = useState<string>("");
  const [markClass, setMarkClass] = useState<string>('');
  const [player, setPlayer] = useState<"X" | "O">("X");
  const [scoreBoard, setScoreBoard] = useState<{ PlayerX: number; PlayerO: number; }>({ PlayerX: 0, PlayerO: 0 });


  useEffect(() => { 
    ResetGame({ setState, setPlayer, winner, setWinner, setMarkClass, player, scoreBoard, setScoreBoard, markClass });
  },[])

  //updating board with each movement
  const UpdateBoardHandler = (row: number[], box: number) => {
    if (winner !== "") {
      return;
    }
    const rowIndex = state.indexOf(row);
    const boxIndex = row.indexOf(box);
    UpdateGame({
      rowIndex,
      boxIndex,
      state,
      setState,
      setPlayer,
      setWinner,
      setMarkClass,
      player,
      scoreBoard,
      setScoreBoard,
    });
  };

  //only resetting the board
  const resetGameHandler = () => {
    // toggle(true);
    
    if (winner) {
        ResetGame({ setState, setPlayer, winner, setWinner, setMarkClass, player, scoreBoard, setScoreBoard, markClass });
    } else {
      setTimeout(
        () =>
          ResetGame({ setState, setPlayer, winner, setWinner, setMarkClass, player, scoreBoard, setScoreBoard, markClass }),
        1000
      );
    }
    
    // if (player === "O") {
    //   SystemMove({player, setState, setPlayer, setMarkClass, setWinner, scoreBoard, setScoreBoard})
    // }
  };


  return (
      <>
        <Navbar />
        <div className="main_container">

          {/* Game Board */}
          {state.length > 0 && (
            <div>
              {winner && (
                <div className="messageBox">
                  <h2>{`Winner is ${winner}`}</h2>
                  <button onClick={resetGameHandler}>RESET</button>
                </div>
              )}

              <div className="tictactoe_boxes">
                {markClass && <div className={`markLine ${markClass}`} />}
                {state.map((row) =>
                  row.map((box, index) => (
                    <div
                      className="tictactoe_box"
                      key={index}
                      onClick={() => UpdateBoardHandler(row, box)} >{isNaN(box) && box}</div>
                  ))
                )}

                {!winner && <div className="playerName"><p>{`Player ${player}'s turn`}</p></div>}

                <div className="scoreBoard"><p>{`Player X: ${scoreBoard.PlayerX} - Player O: ${scoreBoard.PlayerO}`}</p></div>
              </div>
            </div>
          )}
        </div>
    </>
  )
};

export default TicTacToe;
