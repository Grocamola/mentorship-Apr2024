

type UpdageGameProps = {
    rowIndex: number, 
    boxIndex: number, 
    setWinner: (player: "X" | "O") => void, 
    state: number[][], 
    setState: (board: number[][]) => void;
    setPlayer: (player: "X" | "O") => void;
    player: "X" | "O",
    setMarkClass:(className: string) => void, 
    scoreBoard: { PlayerX: number; PlayerO: number; };
    setScoreBoard: (updatedScore: { PlayerX: number; PlayerO: number; }) => void;
}

const UpdateGame = ({
    rowIndex, 
    boxIndex, 
    setWinner, 
    state, 
    setState, 
    setPlayer, 
    player, 
    setMarkClass,
    scoreBoard, 
    setScoreBoard }: UpdageGameProps) => {

    if(isNaN(state[rowIndex][boxIndex])) { 
        console.log('this cell is already taken :) try another one')
        return
    } else {
        try {
            fetch('http://localhost:5000/move/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ "x": rowIndex, "y": boxIndex, "player": player })
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
                       const nextPlayer = player === "X" ? "O" : "X";
                       setPlayer(nextPlayer);
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
                    console.error('Update failed. Error fetching the board:', error);
                });
        } catch (error) {
            console.error('Update failed. Error occurred while fetching data:', error);
        }
    }


    


    return;
}

export default UpdateGame;
