import axios from 'axios';
import{createContext, useState, useEffect, ReactNode} from 'react';
import React from 'react';


interface User {
    role: string;
    name: string;
    
  }

  interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    login: (userData: User) => void;
    logout: () => void;
  }


export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserContextProviderProps {
    children: ReactNode;
  }

  export function UserContextProvider({ children }: UserContextProviderProps){

    const [user, setUser] = useState<User | null>(null);

    //funktion för att logga in
    const login = (userData: User) => {
        setUser(userData);
      };
    
      // Funktion för att logga ut
      const logout = () => {
        setUser(null);
        
      };
    useEffect(()=> {
        if(!user) {
            axios.get('/profile').then(({data})=> {
                setUser(data)
            })
        }
    }, [user])
    return(
        <UserContext.Provider value={{user, setUser, login,logout}}>
            {children}

        </UserContext.Provider>
    )
}