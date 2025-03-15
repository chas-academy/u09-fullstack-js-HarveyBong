import axios from 'axios';
import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { UserContext } from '../../context/userContext';

const UserSettings: React.FC = () => {

  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  const { user, setUser } = userContext;
  const [username, setUsername] = useState<string>(user?.name || ''); 
  const [email, setEmail] = useState<string>(user?.email || '');
  const [password, setPassword] = useState<string>('');

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_RENDER_URL}/update-profile`, {
        username,
        email,
        password,
      }, { withCredentials: true });

      if (response.status === 200) {
        toast.success('Profilen uppdaterades!');
        
        // Uppdatera användarnamnet direkt i UserContext
        setUser((prevUser) => prevUser ? { ...prevUser, name: username } : null);

        // Spara den uppdaterade användaren i localStorage
        localStorage.setItem('user', JSON.stringify({ ...user, name: username }));
      } else {
        toast.error('Misslyckades med att uppdatera profilen');
      }
    } catch (error) {
      console.error('Fel vid uppdatering:', error);
      toast.error('Ett fel inträffade vid uppdatering av profilen');
    }
  };
  

  return (
    <div className="p-4 text-white">
      <h1 className="text-3xl font-bold mb-4">Inställningar</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium">Användarnamn</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 p-2 block w-full border text-black border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium">E-postadress</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium ">Lösenord</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
        />
      </div>
      <button
        onClick={handleSaveChanges}
        className="bg-greenish-gray text-white p-2 rounded-md hover:bg-greenish-gray/90"
      >
        Spara ändringar
      </button>
    </div>
  );
};

export default UserSettings;
