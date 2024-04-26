
const UpdateGame = ({row, box, setWinner, winner, setState, setPlayer, player}) => {

    console.log(row, box, player)
    try {
        fetch('http://localhost:5000/move/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ row, box, player })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Update failed. Failed to fetch the board, Bad response.');
                }
                return response.json();
            })
            .then(data => {
                console.log('Board fetched successfully:', data);

                setState(data.board)
                setWinner(data.winner)
                setPlayer(winner === "X" || winner === "O" ? winner : "X");

            })
            .catch(error => {
                console.error('Update failed. Error fetching the board:', error);
            });
    } catch (error) {
        console.error('Update failed. Error occurred while fetching data:', error);
    }


    return;
}

export default UpdateGame;
