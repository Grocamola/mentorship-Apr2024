

const ResetGame = (props) => { 
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