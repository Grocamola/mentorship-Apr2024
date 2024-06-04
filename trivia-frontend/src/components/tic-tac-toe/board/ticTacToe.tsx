import { useEffect, useState } from "react";
import socket from "../../trivia-utils/requests/socket";
// import SignInForm from "../../trivia-utils/requests/signInForm/signInForm";
import ResetGame from "../utils/resetGame";
import UpdateGame from "../utils/updateGame";

import "./ticTacToe.css";
import Navbar from "../../trivia-utils/ui/navbar/navbar";


export type TicTacToeBoard = number[][];
interface ChatMessage {
  userId: string;
  message: string;
}

const TicTacToe = () => {

  const [state, setState] = useState<TicTacToeBoard>([]);
  const [winner, setWinner] = useState<string>("");
  const [markClass, setMarkClass] = useState<string>('');
  const [player, setPlayer] = useState<"X" | "O">("X");
  const [scoreBoard, setScoreBoard] = useState<{ PlayerX: number; PlayerO: number; }>({ PlayerX: 0, PlayerO: 0 });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState<string>("");
  const [userId] = useState<string>(socket.id!);  


  useEffect(() => { 
    ResetGame({ setState, setPlayer, winner, setWinner, setMarkClass, player, scoreBoard, setScoreBoard, markClass });

     // Listen for incoming chat messages
     socket.on("chatMessage", (data: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("chatMessage");
    };
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

  const tttSendMessage = () => {
    if (message.trim()) {
      socket.emit("chatMessage", { userId, message });
      setMessage("");
    }
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
                        <div className="chatBox">
                          <div className="ttt_messages">
                            {messages.map((msg, index) => (
                              <p key={index} className={msg.userId === userId ? 'myMessage' : 'otherMessage'}>{msg.message}</p>
                            ))}
                          </div>
                          <div className="ttt_messageinputfields">
                            <div className="ttt_ChatInput">
                              <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                              />
                            </div>
                            <div className="ttt_messageSendbtn">
                              <button onClick={tttSendMessage}>SEND</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                };

export default TicTacToe;