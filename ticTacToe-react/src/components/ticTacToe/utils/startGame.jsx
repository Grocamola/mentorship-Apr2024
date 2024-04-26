


const StartGame = ({ setState, setPlayer, setWinner, setMarkClass }) => {
    fetch('http://localhost:5000/board/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch the board, Bad response.');
            }
            return response.json();
        })
        .then(data => {
            // console.log('Board fetched successfully:', data);

            setState(data.board);
            setPlayer(data.winner === "X" || data.winner === "O" ? data.winner : "X");
            setWinner('');
            setMarkClass('');
        })
        .catch(error => {
            console.error('Error fetching the board:', error);
        });
};

export default StartGame;
