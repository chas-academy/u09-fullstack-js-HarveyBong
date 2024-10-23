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
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    if (file) {
      formData.append('image', file);
    }
    formData.forEach((value, key) => {
      console.log(`Form data: ${key} = ${value}`);
    });
    try {
      const response = await axios.post('http://localhost:8000/items', formData, {
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
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input 
        type="text" 
        placeholder="Title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        className="border p-2 w-full"
      />
      <textarea 
        placeholder="Description" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        className="border p-2 w-full"
      />
      <input 
        type="number" 
        placeholder="Price" 
        value={price} 
        onChange={(e) => setPrice(e.target.value)} 
        className="border p-2 w-full"
      />
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files?.[0] || null)} 
        className="border p-2"
      />
      <button type="submit" className="bg-blue-500 mx-2 hover:bg-black text-white p-2 rounded-md">Publish</button>
    </form>
  );
};

export default PublishItemForm;
