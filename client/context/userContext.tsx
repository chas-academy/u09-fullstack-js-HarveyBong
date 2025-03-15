import axios from 'axios';
import { createContext, useState, useEffect, ReactNode } from 'react';
import React from 'react';

interface User {
  _id: string; 
  name: string;
  email: string;
  role: 'Expert' | 'Customer' | 'Admin';
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

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Funktion för att logga in
  const login = (userData: User) => {
    console.log('Logging in user:', userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Spara användaren i localStorage
  };

  // Funktion för att logga ut
  const logout = async () => {
    console.log('Logging out user:', user);
    try {
      await axios.post('/logout', {}, { withCredentials: true });
      setUser(null);
      localStorage.removeItem('user'); // Ta bort användaren från localStorage
      console.log('User successfully logged out');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    } else {
      
      axios
        .get('/profile', { withCredentials: true })
        .then(({ data }) => {
          console.log('Fetched user profile data:', data);
          console.log('Env render url:', import.meta.env.VITE_RENDER_URL);
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error);
        });
    }
  }, []);
  

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
