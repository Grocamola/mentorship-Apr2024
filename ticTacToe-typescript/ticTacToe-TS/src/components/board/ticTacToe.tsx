import { useMemo, useState, FormEvent } from "react";
import useAuth from "../hooks/useAuth";

import SignInForm from "../utils/signInForm/signInForm";
import ResetGame from "../utils/resetGame";
import UpdateGame from "../utils/updateGame";
// import SystemMove from "../utils/systemMove";

import "./ticTacToe.css";


export type TicTacToeBoard = number[][];
interface signInForm {
  username: string;
  password: string;
}

const TicTacToe = () => {
  const [user, setUser] = useState<string>('')
  const [signinErrorClass, setSigninErrorClass] = useState(false)
  const [state, setState] = useState<TicTacToeBoard>([]);
  const [winner, setWinner] = useState<string>("");
  const [markClass, setMarkClass] = useState<string>('');
  const [player, setPlayer] = useState<"X" | "O">("X");
  const [scoreBoard, setScoreBoard] = useState<{ PlayerX: number; PlayerO: number; }>({ PlayerX: 0, PlayerO: 0 });

  const [hover, toggle] = useState(false);


  useMemo(() => {
    if (state.length === 0) {
      return;
    }
    const status =
      state &&
      state
        .map((row) => row.filter((item) => !isNaN(item)))
        .map((rowStatus) => rowStatus.length < 1);
    status.every((item) => item === true) &&
      !winner &&
      setWinner("no one, sorry :)");
  }, [state, winner]);

  //checking if user is saved locally before starting the game
  useMemo(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        setUser(storedUser);
    } 
  },[])


  //Starting the game, checking user credentials and entering the game
  const startGameHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toggle(true);

    const credentials: signInForm = {
      username: user
        ? user
        : (e.currentTarget.elements.namedItem("username") as HTMLInputElement)
            .value,
      password: (
        e.currentTarget.elements.namedItem("password") as HTMLInputElement
      ).value,
    };

    if (credentials.username.length > 3 && credentials.password.length > 3) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const approvedUser = await useAuth({
        username: credentials.username,
        password: credentials.password,
      });
      if (approvedUser) {
        setSigninErrorClass(false)
        ResetGame({ setState, setPlayer, winner, setWinner, setMarkClass, player, scoreBoard, setScoreBoard, markClass });
      } else { 
        setSigninErrorClass(true)
      }
    }
  };

  // Removing localStorage data and erase the form
  const eraseUserHandler = () => { 
    localStorage.removeItem('user');
    setUser('')
  }

  //only resetting the board
  const resetGameHandler = () => {
    toggle(true);
    
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

  return (
    <div className="main_container">

      {/* Sign-in form */}
      {state && state.length === 0 && <SignInForm 
        user={user} 
        startGameHandler={startGameHandler} 
        eraseUserHandler={eraseUserHandler} 
        signinErrorClass={signinErrorClass} 
        hover={hover} />}


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
                  onClick={() => UpdateBoardHandler(row, box)}>{isNaN(box) && box}</div>
              ))
            )}

            {!winner && <div className="playerName"><p>{`Player ${player}'s turn`}</p></div>}

            <div className="scoreBoard"><p>{`Player X: ${scoreBoard.PlayerX} - Player O: ${scoreBoard.PlayerO}`}</p></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicTacToe;
