import { FormEvent, useMemo, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useUserContext } from '../hooks/context';
import { useSpring, animated } from "@react-spring/web";
import useMeasure from "react-use-measure";
import socket from '../requests/socket';


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


const SigninSignUpForm = () => {

    const { user, setUser } = useUserContext(); //email that is set in context hook and localStorage
    const [signin, setSignin] = useState<'in' | 'up'>('in');


    // Check if user is saved locally before starting the game
    useMemo(() => {
      const storedUser = localStorage.getItem("email");
      if (storedUser) {
        setUser(storedUser);
      }
    }, [user]);

    // Animation configs
    const [hover, toggle] = useState(false);
    const [ref, { width }] = useMeasure();
    const props = useSpring({ width: hover ? width : 0 });

    const signinFormHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const credentials: signInForm = {
          email: user ? user : (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value,
          password: (e.currentTarget.elements.namedItem("password") as HTMLInputElement).value,
        };
        console.log(credentials);
    
        // Check auth here
        if (credentials.email.length > 3 && credentials.password.length > 3) {
          const approvedUser = await useAuth({ email: credentials.email, password: credentials.password })
            if(approvedUser) { 
              toggle(true);
              console.log('approved user', approvedUser);
              setUser(credentials.email)
              socket.emit('connecting')
            }
        }
    };

    useMemo(() => {
      toggle(false)
    }, [user])

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
            setUser(approvedUser)
            socket.emit('connecting');
            setTimeout(() => { toggle(false) }, 100);
          } else {
            console.log('check your info again. something is wrong here :|');
          }
        }
    };

    return ( 
        <>
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
        </>
     );
}
 
export default SigninSignUpForm;