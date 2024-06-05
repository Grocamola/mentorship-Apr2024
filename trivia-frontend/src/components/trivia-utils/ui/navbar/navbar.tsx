import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../hooks/context';
import './navbar.css'


const Navbar = () => {

    const { setUser } = useUserContext();

    const navigate = useNavigate()
    
    const signoutHandler = () => {
        setUser('')
        if (localStorage.getItem('email')) {
            localStorage.removeItem('email');
            console.log(`Removed email from local storage.`);
        }
    
        if (localStorage.getItem('user')) {
            localStorage.removeItem('user');
            console.log(`Removed user from local storage.`);
        }
        if (localStorage.getItem('name')) {
            localStorage.removeItem('name');
            console.log(`Removed name from local storage.`);
        }

        navigate('/', {replace: true})
    }

    return ( 
        <div className='navbar'>
            <button style={{border: 'none', background: 'none', color: 'black'}} onClick={() => navigate('/', {replace: true})}><p>Groca-trivia!</p></button>
            <button onClick={signoutHandler}>Sign Out</button>
        </div>
     );
}
 
export default Navbar;