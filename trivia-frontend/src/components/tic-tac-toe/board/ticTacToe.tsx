import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../trivia-utils/ui/navbar/navbar";
import socket from "../../trivia-utils/requests/socket";
import "./ticTacToe.css";
import { ChatMessage, SocketResponseType, ResetResponseType, SocketUpdateResponseType, TicTacToeBoard, PlayersType } from '../ttt-Types';

const TicTacToe = () => {
  const { roomId } = useParams();
  const [state, setState] = useState<TicTacToeBoard>([]);
  const [winner, setWinner] = useState<string>("");
  const [markClass, setMarkClass] = useState<string>('');
  const [player, setPlayer] = useState<string>('');
  const [players, setPlayers] = useState<PlayersType[]>([{ playerName: 'X', playerCode: '' }, { playerName: 'O', playerCode: '' }]);
  const [scoreBoard, setScoreBoard] = useState<{ PlayerX: number; PlayerO: number; }>({ PlayerX: 0, PlayerO: 0 });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState<string>("");
  const [userId] = useState<string>(socket.id!);
  const playerX = players.filter(player => player.playerName === "X")[0]?.playerCode;
  const playerO = players.filter(player => player.playerName === "O")[0]?.playerCode;

  useEffect(() => {
    socket.emit('joinRoom', roomId);

    socket.on("chatMessage", (data: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on('resetBoard', (data: ResetResponseType) => resetBoard(data));

    socket.on('usersInfo', (playersData: PlayersType[]) => {
      setPlayers(playersData);
    });

    socket.on('updateUserBoard', (data: SocketUpdateResponseType) => updateBoard(data));

    return () => {
      socket.emit('leaveRoom', roomId);
      socket.off("chatMessage");
      socket.off('updateUserBoard');
      socket.off('resetBoard');
      socket.off('usersInfo');
    };
  }, [roomId]);

  const updateBoard = (data: SocketUpdateResponseType) => {
    if (data.winner === '' && !data.isTie) {
      setState(data.board);
      setPlayer(data.nextPlayer);
    } else {
      setState(data.board);
      setWinner(data.winner);
      setMarkClass(data.winnerClass);
      setPlayer(data.nextPlayer);

      setScoreBoard(prevScoreBoard => ({
        PlayerX: data.winner === playerX ? prevScoreBoard.PlayerX + 1 : prevScoreBoard.PlayerX,
        PlayerO: data.winner === playerO ? prevScoreBoard.PlayerO + 1 : prevScoreBoard.PlayerO
      }));
    }

    if (data.isTie) {
      setWinner('Tie');
    }
  };

  const UpdateBoardHandler = (row: number[], box: number) => {
    if (player === socket.id) { 
      const rowIndex = state.indexOf(row);
      const boxIndex = row.indexOf(box);

      if (isNaN(state[rowIndex][boxIndex])) {
        return;
      }
      socket.emit('userMove', { roomId, rowIndex, boxIndex, player }, (data: SocketResponseType) => {
        if (data.success) {
          updateBoard(data.data);
        } else {
          console.error('Error updating the board via socket:', data.error);
        }
      });
    }
  };

  const resetBoard = (data: ResetResponseType) => {
    setState(data.board);
    setPlayer(data.nextPlayer);
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

  useEffect(() => {
    resetGameHandler();
  }, [roomId]);

  return (
    <>
      <Navbar />
      <div className="main_container">
        {state.length > 0 && (
          <div>
            {winner && (
              <div className="messageBox">
                <h2>{winner === 'Tie' ? 'It\'s a Tie!' : `Winner is ${winner === playerX ? "X" : winner === playerO ? "O" : null}`}</h2>
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
                    onClick={() => UpdateBoardHandler(row, box)}>{isNaN(box) ? (box.toString() === playerX ? "X" : (box.toString() === playerO ? "O" : box)) : ""}</div>
                ))
              )}
              {!winner && <div className="playerName"><p>{`${socket.id === playerX ? "Player X" : " Player O"}'s turn`}</p></div>}
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
