import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../trivia-utils/ui/navbar/navbar";
import socket from "../../trivia-utils/requests/socket";
import "./ticTacToe.css";

import { ChatMessage, SocketResponseType, ResetResponseType, SocketUpdateResponseType, TicTacToeBoard } from '../ttt-Types';


const TicTacToe = () => {
  const { roomId } = useParams();
  const [state, setState] = useState<TicTacToeBoard>([]);
  const [winner, setWinner] = useState<string>("");
  const [markClass, setMarkClass] = useState<string>('');
  const [player, setPlayer] = useState<"X" | "O">("X");
  const [scoreBoard, setScoreBoard] = useState<{ PlayerX: number; PlayerO: number; }>({ PlayerX: 0, PlayerO: 0 });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState<string>("");
  const [userId] = useState<string>(socket.id!);  

  useMemo(() => { 
    socket.emit('joinRoom', roomId);

    // Listen for incoming chat messages
    socket.on("chatMessage", (data: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on('updateUserBoard', (data: SocketUpdateResponseType) => updateBoard(data));
    socket.on('resetBoard', (data: ResetResponseType) => resetBoard(data));

    // Cleanup on component unmount
    return () => {
      socket.emit('leaveRoom', roomId);
      socket.off("chatMessage");
      socket.off('updateUserBoard');
      socket.off('resetBoard');
    };
  }, [roomId]);

  const updateBoard = (data: SocketUpdateResponseType) => { 
    if(data.winner === '') { 
      setState(data.board); 
      const nextPlayer = player === "X" ? "O" : "X";
      setPlayer(nextPlayer);
    } else { 
      setState(data.board); 
      setWinner(data.winner);
      setMarkClass(data.winnerClass);
      setPlayer(data.winner);

      const updatedScore = {
          PlayerX: data.winner === 'X' ? scoreBoard.PlayerX + 1 : scoreBoard.PlayerX,
          PlayerO: data.winner === 'O' ? scoreBoard.PlayerO + 1 : scoreBoard.PlayerO
      };
      setScoreBoard(updatedScore);
    }
  };

  const UpdateBoardHandler = (row: number[], box: number) => {
    if (winner !== "") {
      return;
    }
    const rowIndex = state.indexOf(row);
    const boxIndex = row.indexOf(box);

    if(isNaN(state[rowIndex][boxIndex])) { 
      return;
    }
    socket.emit('userMove', { roomId, rowIndex, boxIndex, player }, (data: SocketResponseType) => {
      if (data.success) {
        updateBoard(data.data);
      } else {
        console.error('Error updating the board via socket:', data.error);
      }
    });
  };

  const resetBoard = (data: ResetResponseType) => {
    setState(data.board);
    setPlayer(winner === "X" || winner === "O" ? winner : "X");
    setWinner(data.winner);
    setMarkClass(data.winnerClass);
  };

  const resetGameHandler = () => {    
    socket.emit('userReset', { roomId }, (response: SocketResponseType) => {
      if (response.success) {
        resetBoard(response.data);
      } else {
        console.error('Error resetting the board via socket:', response.error);
      }
    });
  };

  const tttSendMessage = () => {
    if (message.trim()) {
      socket.emit("chatMessage", { roomId, userId, message });
      setMessage("");
    }
  };

  useMemo(() => {
    resetGameHandler()
  },[roomId])

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
                    onClick={() => UpdateBoardHandler(row, box)}>{isNaN(box) && box}</div>
                ))
              )}
              {!winner && <div className="playerName"><p>{`Player ${player}'s turn`}</p></div>}
              <div className="scoreBoard"><p>{`Player X: ${scoreBoard.PlayerX} - Player O: ${scoreBoard.PlayerO}`}</p></div>
            </div>
          </div>
        )}
        <div className="chatBox">
          {roomId && <div className="ttt_messages">
            {messages.map((msg, index) => (
              <p key={index} className={msg.userId === userId ? 'myMessage' : 'otherMessage'}>{msg.message}</p>
            ))}
          </div>}
          {roomId && <div className="ttt_messageinputfields">
            <div className="ttt_ChatInput">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="type here..."
              />
            </div>
            <div className="ttt_messageSendbtn">
              <button onClick={tttSendMessage}>SEND</button>
            </div>
          </div>}
        </div>
      </div>
    </>
  );
};

export default TicTacToe;
