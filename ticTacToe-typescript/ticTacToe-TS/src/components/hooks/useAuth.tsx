import { client } from '../../lib/pocketbase'


const useAuth = async({username, password}: {username: string, password: string}): Promise<string> => {

    let approvedUser: string = ''

    try { 
        await client.collection("users").authWithPassword(username, password).then(res => {
            if(res.token) { 
                approvedUser = username;
                localStorage.setItem('user', username)
            }})
    } catch (err) { 
        console.log(err)
    }

    
    client.authStore.clear();
    
    return (approvedUser);
}
 
export default useAuth;