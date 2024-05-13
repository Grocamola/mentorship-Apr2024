import { TicTacToeBoard } from "../board/ticTacToe";
import SystemMove from "./systemMove";

type ResetGameProps = { 
    setState: (board: TicTacToeBoard) => void;
    player: "X" | "O";
    setPlayer: (player: "X" | "O") => void;
    winner: string;
    setWinner: (player: "X" | "O") => void;
    markClass: string;
    setMarkClass: (className: string) => void;
    scoreBoard: { PlayerX: number; PlayerO: number; };
    setScoreBoard: (updatedScore: { PlayerX: number; PlayerO: number; }) => void;
}


const ResetGame = (props: ResetGameProps) => { 
    try {
        fetch('http://localhost:5000/reset', { 
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to reset the board, Bad response.');
            }
            return response.json();
        })
        .then(data => {
            // console.log('Board resetted successfully:', data);
            props.setState(data.board);
            props.setPlayer(props.winner === "X" || props.winner === "O" ? props.winner : "X")
            props.setWinner(data.winner);
            props.setMarkClass(data.winnerClass);
        }).then(() => {
            if (props.player === "O") {
                SystemMove({player:props.player, setState:props.setState, setPlayer:props.setPlayer, setMarkClass:props.setMarkClass, setWinner:props.setWinner, scoreBoard:props.scoreBoard, setScoreBoard:props.setScoreBoard})
            }
        })
        .catch(error => {
            console.error('Error resetting the board:', error);
        });
    } catch (error) {
        console.error('Error occurred while fetching data:', error);
    }

    return;
}

export default ResetGame;