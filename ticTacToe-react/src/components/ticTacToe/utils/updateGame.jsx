
const UpdateGame = ({rowIndex, boxIndex, setWinner, state, setState, setPlayer, player, setMarkClass}) => {

    // console.log(rowIndex, boxIndex, player)

    if(state[rowIndex][boxIndex] === "X" || state[rowIndex][boxIndex] === "Y") { 
        throw new Error('Clicked on a taken cell.')
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
                       setPlayer(player => player === "X" ? "O" : "X");
                    } else { 
                        setState(data.board) 
                        setWinner(data.winner)
                        setMarkClass(data.winnerClass);
                        setPlayer(data.winner);
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
