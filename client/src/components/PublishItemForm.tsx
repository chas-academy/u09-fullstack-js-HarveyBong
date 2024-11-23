import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import axios from 'axios';

const PublishItemForm = () => {
  const userContext = useContext(UserContext);
  
  if (!userContext || !userContext.user) {
    toast.error('User not authenticated. Please log in first.');
    return <Navigate to="/login" />;
  }
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    if (file) {
      formData.append('image', file);
    }
    
    try {
      const response = await axios.post('https://u09-fullstack-js-harveybong.onrender.com/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, 
      });
  
      if (response.status === 201) {
        toast.success('Item successfully published!');
        navigate('/');
      } else {
        toast.error('Failed to publish the item.');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error publishing item:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      toast.error('Failed to publish the item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-dark-gray rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-light-beige">Publicera din annons</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-light-beige">Titel</label>
            <input
              type="text"
              placeholder="Titel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 text-sm border border-greenish-gray rounded-lg focus:outline-none focus:ring focus:ring-greenish-gray"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-light-beige">Beskrivning</label>
            <textarea
              placeholder="Beskrivning"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 text-sm border border-greenish-gray rounded-lg focus:outline-none focus:ring focus:ring-greenish-gray"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-light-beige">Köpt för</label>
            <input
              type="number"
              placeholder="Pris"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2 text-sm border border-greenish-gray rounded-lg focus:outline-none focus:ring focus:ring-greenish-gray"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-light-beige">Bild</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 text-sm border text-light-beige border-greenish-gray rounded-lg focus:outline-none focus:ring focus:ring-greenish-gray"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 font-semibold text-white bg-greenish-gray opacity-70 rounded-lg hover:opacity-100 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Publicerar...' : 'Publicera'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublishItemForm;