import { createContext, useContext, useState, ReactNode } from "react";

type ContextProps = {
    user: string;
    setUser: (user: string) => void;
};

export const UserContext = createContext<ContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<string>("");

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export function useUserContext() {
    const context = useContext(UserContext);

    if (context === undefined) {
        throw new Error("useUserContext must be used within a UserProvider");
    }

    return context;
}
