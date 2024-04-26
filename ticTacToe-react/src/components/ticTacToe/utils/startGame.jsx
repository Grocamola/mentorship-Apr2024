


const StartGame = (props) => {
    try {
        fetch('http://localhost:5000/board/', { 
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch the board, Bad response.');
            }
            return response.json();
        })
        .then(data => {
            console.log('Board fetched successfully:', data);

            props.setState(data.board);
            props.setPlayer(props.winner === "X" || props.winner === "O" ? props.winner : "X")
            props.setWinner(data.winner);
            props.setMarkClass();
        })
        .catch(error => {
            console.error('Error fetching the board:', error);
        });
    } catch (error) {
        console.error('Error occurred while fetching data:', error);
    }

    return null;
}

export default StartGame;
