
type SystemMove = { 
    player: "X" | "O";
    setState: (board: number[][]) => void;
    setPlayer: (player: "X" | "O") => void;
    setMarkClass:(className: string) => void, 
    scoreBoard: { PlayerX: number; PlayerO: number; };
    setScoreBoard: (updatedScore: { PlayerX: number; PlayerO: number; }) => void;
    setWinner: (player: "X" | "O") => void, 
}

const SystemMove = ({player, setState, setPlayer, setMarkClass, setWinner, scoreBoard, setScoreBoard}: SystemMove) => { 

    try {
        fetch('http://localhost:4000/tic-tac-toe/system-move/', { 
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ "player": player })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Update failed. Failed to fetch the board, Bad response.');
            }
            return response.json();
        })
        .then(data => {
            // console.log('Board fetched and updated successfully:', data);

            if(data.winner === '') { 
                setState(data.board) 
                setPlayer("X");                
            } else { 
                setState(data.board) 
                setWinner(data.winner)
                setMarkClass(data.winnerClass);
                setPlayer(data.winner);

                const updatedScore = {
                    PlayerX: data.winner === 'X' ? scoreBoard.PlayerX + 1 : scoreBoard.PlayerX,
                    PlayerO: data.winner === 'O' ? scoreBoard.PlayerO + 1 : scoreBoard.PlayerO
                }
                setScoreBoard(updatedScore);
            }
            })
        .catch(error => {
            console.error('Error resetting the system move:', error);
        });
    } catch (error) {
        console.error('Error occurred while fetching system move:', error);
    }

    return;
}

export default SystemMove;