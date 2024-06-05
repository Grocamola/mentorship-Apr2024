import { FormEvent, useMemo, useState, useEffect } from 'react';
import socket from '../trivia-utils/requests/socket';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated } from "@react-spring/web";
import useMeasure from "react-use-measure";

import ttt from '../../assets/tictactoe-icon.png';
import useAuth from '../trivia-utils/hooks/useAuth';
import Navbar from '../trivia-utils/ui/navbar/navbar';
import { useUserContext } from '../trivia-utils/hooks/context';

import './mainPage.css';
import '../../components/trivia-utils/ui/styles/main-styles.css';
import getOnlineUsers from '../trivia-utils/requests/requests/get-online-users';

type signInForm = {
  email: string;
  password: string;
};

type signUpForm = {
  name: string;
  email: string;
  password: string;
  confirm: string;
};

export type mainPageProps = {
  setUser: (value: string) => void;
};

const MainPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserContext();

  // Animation configs
  const [hover, toggle] = useState(false);
  const [ref, { width }] = useMeasure();
  const props = useSpring({ width: hover ? width : 0 });

  // Game configs
  const game = 'ttt';
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [signin, setSignin] = useState<'in' | 'up'>('in');

  // Should get users from pocketbase here
  const [players, setPlayers] = useState<string[]>([]);

  const pickPlayerHandler = (e: string) => {
    // const confirmed = window.confirm('Do you want to invite this user to play a game?');
    // if (confirmed) {
      socket.emit('invite', e, socket.id); // Pass sender's socket ID as well
      navigate('/tic-tac-toe');
    // }
  };

  // Check if user is saved locally before starting the game
  useEffect(() => {
    const storedUser = localStorage.getItem("email");
    if (storedUser) {
      setUser(storedUser);
    }
  }, [setUser]);

  useEffect(() => {
    socket.on('activeUsers', (users) => setPlayers([...users]));
    return () => {
      socket.off('activeUsers');
    };
  }, []);

  // Listen for invitation event
  useMemo(() => {
    socket.on('invitation', ({ roomId }) => {
    //   const confirmed = window.confirm('You have received a game invitation. Do you want to accept?');
    //   if (confirmed) {
        // Emit event to accept the invitation
        socket.emit('acceptInvitation', { roomId });
        navigate(`/tic-tac-toe`);
    //   }
    });

    return () => {
      socket.off('invitation');
    };
  }, [navigate]);

  const signinFormHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const credentials: signInForm = {
      email: user ? user : (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value,
      password: (e.currentTarget.elements.namedItem("password") as HTMLInputElement).value,
    };
    console.log(credentials);

    // Check auth here
    if (credentials.email.length > 3 && credentials.password.length > 3) {
      const approvedUser = await useAuth({
        email: credentials.email,
        password: credentials.password,
      });
      if (approvedUser) {
        toggle(true);
        console.log('approved user');
        setTimeout(() => { setUser(approvedUser) }, 200);

        let allPlayers = getOnlineUsers();
        setPlayers((await allPlayers).map(item => item.name));
      } else {
        console.log('you are not a user !!!');
      }
    }
  };

  useEffect(() => {
    toggle(false);
  }, [user]);

  const signupFormHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toggle(false);
    const credentials: signUpForm = {
      name: (e.currentTarget.elements.namedItem("name") as HTMLInputElement).value,
      email: user ? user : (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value,
      password: (e.currentTarget.elements.namedItem("password") as HTMLInputElement).value,
      confirm: (e.currentTarget.elements.namedItem("confirm") as HTMLInputElement).value
    };
    console.log(credentials);

    if (credentials.email.length > 3 && credentials.password.length > 3 && credentials.name.length > 3 && credentials.password === credentials.confirm) {
      const approvedUser = await useAuth({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        confirm: credentials.confirm
      });
      if (approvedUser) {
        toggle(true);
        console.log('signed in new user.');
        setTimeout(() => { setUser(approvedUser) }, 300);
      } else {
        console.log('check your info again. something is wrong here :|');
      }
    }
  };

  const startTheGameHandler = () => {
    if (game === 'ttt') {
      navigate('/tic-tac-toe', { replace: true });
    }
  };

  return (
    <>
      <Navbar />
      {!user && <div className="signinModal">
        <div className="modalBackground" />
        <div className="modalForm">
          {signin === 'in' && <form onSubmit={signinFormHandler}>
            <div className="formRow"><label htmlFor="email">Email</label><input type="email" name="email" /></div>
            <div className="formRow"><label htmlFor="password">Password</label><input type="password" name="password" /></div>
            <div className="formRow">
              <button ref={ref} type="submit" className="main">
                <animated.div className="fill" style={props} />
                <animated.div className="content">
                  {props.width.to((x: number) => x.toFixed(0))}
                </animated.div>
                <p style={{ margin: "0 auto", display: width >= 100 ? "block" : "none", zIndex: 100, }}>
                  Sign In
                </p>
              </button>
            </div>
          </form>}
          {signin === 'up' && <form onSubmit={signupFormHandler}>
            <div className="formRow"><label htmlFor="name">Name</label><input name="name" type="text" /></div>
            <div className="formRow"><label htmlFor="email">Email</label><input name="email" type="email" /></div>
            <div className="formRow"><label htmlFor="password">Password</label><input name="password" type="password" /></div>
            <div className="formRow"><label htmlFor="confirm">Confirm Password</label><input name="confirm" type="password" /></div>
            <div className="formRow"><button type="submit">Sign Up</button></div>
          </form>}
          {signin === 'in' ? <div>
            <button
              style={{ background: 'none', color: 'black', cursor: 'pointer', marginTop: 0 }}
              onClick={() => setSignin('up')}>Create account now</button>
          </div> : <div>
            <button
              style={{ background: 'none', color: 'black', cursor: 'pointer', marginTop: 0 }}
              onClick={() => setSignin('in')}>Login</button>
          </div>}
        </div>
      </div>}
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
          <div className="playerList">
            <ul>
              {players.map((player, index) => player !== socket.id && <li key={player}>
                <p>Player {index + 1}</p>
                <button onClick={() => pickPlayerHandler(player)}>
                  INVITE
                </button>
              </li>)}
            </ul>
          </div>
          <div className="systemPlay">
            <div>
              <input type="checkbox" checked={competitors.length < 1} onChange={() => setCompetitors([])} />
              <span style={{ color: competitors.length > 0 ? '#ccc' : 'black' }}>Play With Computer</span>
              <div className="startTheGame">
                <button onClick={startTheGameHandler}>{'Start The Game'}</button>
              </div>
            </div>
          </div>
        </div>
        <br />
      </div>
    </>
  );
};

export default MainPage;
