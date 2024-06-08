// import socket from "../../trivia-utils/requests/socket";
// import { TicTacToeBoard } from "../board/ticTacToe";
// import SystemMove from "./systemMove";

// type ResetGameProps = {
//     setState: (board: TicTacToeBoard) => void;
//     player: "X" | "O";
//     setPlayer: (player: "X" | "O") => void;
//     winner: string;
//     setWinner: (player: "X" | "O") => void;
//     markClass: string;
//     setMarkClass: (className: string) => void;
//     scoreBoard: { PlayerX: number; PlayerO: number; };
//     setScoreBoard: (updatedScore: { PlayerX: number; PlayerO: number; }) => void;
//     roomId: string | undefined;
// }
// interface ResetResponseType {
//     board: TicTacToeBoard;
//     winner: "X" | "O";
//     winnerClass: string;
// }

// interface SocketResetResponseType {
//     success: boolean;
//     data: ResetResponseType;
//     error?: string;
// }

// const ResetGame = (props: ResetGameProps) => {
//     const resetBoard = (data: ResetResponseType) => {
//         props.setState(data.board);
//         props.setPlayer(props.winner === "X" || props.winner === "O" ? props.winner : "X");
//         props.setWinner(data.winner);
//         props.setMarkClass(data.winnerClass);

//         if (props.player === "O") {
//             SystemMove({
//                 player: props.player,
//                 setState: props.setState,
//                 setPlayer: props.setPlayer,
//                 setMarkClass: props.setMarkClass,
//                 setWinner: props.setWinner,
//                 scoreBoard: props.scoreBoard,
//                 setScoreBoard: props.setScoreBoard
//             });
//         }
//     };

//     if (props.roomId === undefined) {
//         try {
//             fetch('http://localhost:4000/tic-tac-toe/reset', {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             })
//                 .then(response => {
//                     if (!response.ok) {
//                         throw new Error('Failed to reset the board, Bad response.');
//                     }
//                     return response.json();
//                 })
//                 .then(data => {
//                     resetBoard(data);
//                 })
//                 .catch(error => {
//                     console.error('Error resetting the board:', error);
//                 });
//         } catch (error) {
//             console.error('Error occurred while fetching data:', error);
//         }
//     } else {
//         socket.emit('userReset', { roomId: props.roomId }, (response: SocketResetResponseType) => {
//             if (response.success) {
//                 resetBoard(response.data);
//             } else {
//                 console.error('Error resetting the board via socket:', response.error);
//             }
//         });
//     }

//     return null;
// }

// export default ResetGame;
