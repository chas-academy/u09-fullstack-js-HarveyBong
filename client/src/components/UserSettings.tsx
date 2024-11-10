import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const UserSettings: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put('https://u09-fullstack-js-harveybong.onrender.com/update-profile', {
        username,
        email,
        password,
      }, {
        withCredentials: true, 
      });
  
      if (response.status === 200) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating the profile');
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
