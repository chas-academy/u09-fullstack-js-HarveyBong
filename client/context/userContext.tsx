import axios from 'axios';
import{createContext, useState, useEffect, ReactNode} from 'react';
import React from 'react';


interface User {
    name: string;
    
  }

  interface UserContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
  }


export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserContextProviderProps {
    children: ReactNode;
  }

  export function UserContextProvider({ children }: UserContextProviderProps){

    const [user, setUser] = useState<User | null>(null);

    useEffect(()=> {
        if(!user) {
            axios.get('/profile').then(({data})=> {
                setUser(data)
            })
        }
    }, [user])
    return(
        <UserContext.Provider value={{user, setUser}}>
            {children}

        </UserContext.Provider>
    )
}