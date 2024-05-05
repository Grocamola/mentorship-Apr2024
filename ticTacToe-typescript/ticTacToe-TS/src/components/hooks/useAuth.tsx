

const useAuth = ({username, password}: {username: string, password: string}): string => {

    console.log(username, password)
    const approvedUser: string = username;
    localStorage.setItem('user', username)
    
    return (approvedUser);
}
 
export default useAuth;