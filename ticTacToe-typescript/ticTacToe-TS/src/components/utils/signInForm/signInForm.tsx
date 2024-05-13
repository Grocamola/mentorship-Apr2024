import * as React from 'react';
import { useSpring, animated } from "@react-spring/web";
import useMeasure from "react-use-measure";

type SignInForm = {
    user: string;
    startGameHandler: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    eraseUserHandler: () => void;
    signinErrorClass: boolean;
    hover: boolean;
}

const SignInForm = ({user, startGameHandler, eraseUserHandler, signinErrorClass, hover }: SignInForm) => {

    const [ref, { width }] = useMeasure();
    const props = useSpring({ width: hover ? width : 0 });


    return <>
         <div>
            <h4>Hey! Welcome to my tic-tac-toe :)</h4>
            <form onSubmit={startGameHandler} className="signInForm">
              <div>
                <label htmlFor="email">Email</label>
                {user.length > 3 ? (
                  <span style={{ display: "inline-block" }}>
                    {user}
                    <p className="clearUser" onClick={eraseUserHandler}>X</p>
                  </span>
                ) : <input type="text" name="username" />}
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input style={{border: signinErrorClass ? '2px solid red' : '1px solid rgb(204, 204, 204)'}} type="password" name="password" required />
              </div>
              <br />
                <p>You: <b>Player X</b><br />vs.<br />Computer: <b>Player O</b></p>
              <button ref={ref} type="submit" className="main">
                <animated.div className="fill" style={props} />
                <animated.div className="content">
                  {props.width.to((x: number) => x.toFixed(0))}
                </animated.div>
                <p style={{margin: "0 auto", display: width >= 100 ? "block" : "none", zIndex: 100, }}>
                  ENTER THE GAME
                </p>
              </button>
            </form>
          </div>
    </>
}
 
export default SignInForm;