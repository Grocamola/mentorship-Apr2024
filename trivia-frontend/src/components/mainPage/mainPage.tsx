import { useMemo, useState } from 'react';
import socket from '../trivia-utils/requests/socket';
import { useNavigate } from 'react-router-dom';


import ttt from '../../assets/tictactoe-icon.png';

import Navbar from '../trivia-utils/ui/navbar/navbar';
import { useUserContext } from '../trivia-utils/hooks/context';

import './mainPage.css';
import '../../components/trivia-utils/ui/styles/main-styles.css';
import SigninSignUpForm from '../trivia-utils/signinForm/signinSignupForm';



export type mainPageProps = {
  setUser: (value: string) => void;
};

const MainPage = () => {

  const navigate = useNavigate();
  const { user } = useUserContext(); //email that is set in context hook and localStorage


  // Game configs
  const game = 'ttt';
  

  // Should get users from pocketbase here
  const [players, setPlayers] = useState<string[]>([]);

  const pickPlayerHandler = (e: string) => {
      socket.emit('invite', e, socket.id); 
  };

 
  // Getting users list
  useMemo(() => {
    socket.on('activeUsers', (users) => setPlayers([...users]));
    console.log(players)
    return () => {
      socket.off('activeUsers');
    };
  }, [user]);


  // Listen for invitation event
  useMemo(() => {
    socket.on('invitation', ({ roomId }) => {
        socket.emit('acceptInvitation', { roomId });
        navigate(`/tic-tac-toe/${roomId}`);
    });

    return () => {
      socket.off('invitation');
    };
  }, [navigate]);

  // const startTheGameHandler = () => {
  //   if (game === 'ttt') {
  //     navigate(`/tic-tac-toe`, { replace: true });
  //   }
  // };



  return (
    <>
      <Navbar />
      {!user && <SigninSignUpForm />}
      <div className="startPlayContainer">
        <div className="gamePick">
          <h2>Pick your game</h2>
          <div className="gameList">
            <div className="gameOption"><img src={ttt} alt="Tic Tac Toe" /></div>
          </div>
        </div>
        <br />
        <h2>Who do you want to play with?</h2>
        <div className="playerPick">
        {players.filter((player) => player !== socket.id).length === 0 && <p>Please wait for others to join...</p>}
          
          
          {players.filter((player) => player !== socket.id).length > 0 &&
          <div className="playerList">
            <ul>
              {players.map((player, index) => player !== socket.id && <li key={player}>
                <p>Player {index + 1}</p>
                <button onClick={() => pickPlayerHandler(player)}>
                  INVITE
                </button>
              </li>)}
            </ul>
          </div>}
          {/* <div className="systemPlay">
            <div>
              <input type="checkbox" /><span>Play With Computer</span>
              <div className="startTheGame">
                <button onClick={startTheGameHandler}>{'Start The Game'}</button>
              </div>
            </div>
          </div> */}
        </div>
        <br />
      </div>
    </>
  );
};

export default MainPage;
