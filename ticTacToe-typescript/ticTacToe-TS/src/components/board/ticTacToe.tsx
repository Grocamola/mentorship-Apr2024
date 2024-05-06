import { useMemo, useState, FormEvent } from "react";
import useAuth from "../hooks/useAuth";
import useMeasure from "react-use-measure";
import { useSpring, animated } from "@react-spring/web";

import ResetGame from "../utils/resetGame";
import UpdateGame from "../utils/updateGame";

import "./ticTacToe.css";

export type TicTacToeBoard = number[][];
interface signInForm {
  username: string;
  password: string;
}

const TicTacToe = () => {
  const [user, setUser] = useState<string>('')
  const [state, setState] = useState<TicTacToeBoard>([]);
  const [winner, setWinner] = useState<string>("");
  const [markClass, setMarkClass] = useState<string>();
  const [player, setPlayer] = useState<"X" | "O">("X");
  const [scoreBoard, setScoreBoard] = useState({ PlayerX: 0, PlayerO: 0 });

  const [hover, toggle] = useState(false);
  const [ref, { width }] = useMeasure();
  const props = useSpring({ width: hover ? width : 0 });

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
  },[user])


  //Starting the game, checking user credentials and entering the game
  const startGameHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
        // setUser(approvedUser);
        ResetGame({ setState, setPlayer, winner, setWinner, setMarkClass });
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
      ResetGame({ setState, setPlayer, winner, setWinner, setMarkClass });
    } else {
      setTimeout(
        () =>
          ResetGame({ setState, setPlayer, winner, setWinner, setMarkClass }),
        1000
      );
    }
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
      {state && state.length === 0 && <div>
          <h4>Hey! Welcome to my tic-tac-toe :)</h4>
          <form onSubmit={startGameHandler} className="signInForm">
            <div>
              <label htmlFor="username">Username</label>
              {user.length > 3 ? (
                <span style={{ display: "inline-block" }}>
                  {user}
                  <p className="clearUser" onClick={eraseUserHandler}>X</p>
                </span>
              ) : <input type="text" name="username" />}
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input type="password" name="password" required />
            </div>
            <br />
            <button ref={ref} type="submit" className="main">
              <animated.div className="fill" style={props} />
              <animated.div className="content">
                {props.width.to((x) => x.toFixed(0))}
              </animated.div>
              <p
                style={{
                  margin: "0 auto",
                  display: width >= 100 ? "block" : "none",
                  zIndex: 100,
                }}
              >
                ENTER THE GAME
              </p>
            </button>
          </form>
        </div>
      }

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
