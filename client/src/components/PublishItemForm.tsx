import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';

const PublishItemForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create form data to send to the backend
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    
    // If a file is selected, append it
    if (file) {
      formData.append('image', file);
    }

    formData.forEach((value, key) => {
      console.log(key, value);
    });
    // Send form data to the backend
    const response = await fetch('http://localhost:8000/items', {
      method: 'POST',
      body: formData, // send FormData
      credentials: 'include',
    });

    if (response.ok) {
      toast.success('Item successfully published!');
      navigate('/')
      
    } else {
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
      <button type="submit" className="bg-blue-500 text-white p-2">Publish</button>
    </form>
  );
};

export default PublishItemForm;