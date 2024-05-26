import { mainPageProps } from '../../../mainPage/mainPage';
import './navbar.css'

type navbarExtraProps = { 
    toggle: (value: boolean) => void
}
type NavbarProps = mainPageProps & navbarExtraProps

const Navbar = ({setUser, toggle}: NavbarProps) => {

    const signoutHandler = () => {
        toggle(false)
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
    }

    return ( 
        <div className='navbar'>
            <p>Groca-game!</p>
            <button onClick={signoutHandler}>Sign Out</button>
        </div>
     );
}
 
export default Navbar;