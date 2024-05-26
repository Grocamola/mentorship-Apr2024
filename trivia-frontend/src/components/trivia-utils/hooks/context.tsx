import { createContext, useContext } from "react";

export const userContext = createContext<string>('')

export function useUserContext() { 
    const user = useContext(userContext)

    if(user === undefined) { 
        console.log('there is no user signed in.')
    }

    return user;
}