import { client } from '../../../lib/pocketbase'

type signinProps = {
    email: string;
    password: string
}
type signupProps = { 
    name: string;
    email: string;
    password: string;
    confirm: string
}

const useAuth = async(props: signinProps | signupProps): Promise<string> => {

    let approvedUser: string = ''

    // Type guard to check if props is of type signupProps
    const isSignupProps = (props: signinProps | signupProps): props is signupProps => {
        return (props as signupProps).confirm !== undefined;
    };

    if (!isSignupProps(props)) {
        try { 
            await client.collection("users").authWithPassword(props.email, props.password).then(res => {
                if(res.token) { 
                    approvedUser = props.email;
                    localStorage.setItem('email', props.email)
                }})
        } catch (err) { 
            console.log(err)
        } 
    } else { 
        try { 
            const data = {
                "username": props.name,
                "email": props.email,
                "emailVisibility": true,
                "password": props.password,
                "passwordConfirm": props.confirm,
                "name": props.name,
            };
            
            const record = await client.collection('users').create(data);
            if(record && record.code === 200) { 
                approvedUser = props.email;
                localStorage.setItem('email', props.email)

            }
            console.log(record)
        } catch (err) { 
            console.log(err)
        }
    }

    

    
    client.authStore.clear();
    
    return (approvedUser);
}
 
export default useAuth;