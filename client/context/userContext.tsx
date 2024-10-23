import axios from 'axios';
import { createContext, useState, useEffect, ReactNode } from 'react';
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
    if (!user) {
      console.log('User is not authenticated, fetching profile...'); // Logga om användaren inte är inloggad
      axios
        .get('/profile', { withCredentials: true })
        .then(({ data }) => {
          console.log('Fetched user profile data:', data); // Logga den hämtade datan
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data)); // Spara användaren i localStorage
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error); // Logga eventuella fel
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
