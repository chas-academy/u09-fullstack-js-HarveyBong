import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/userContext';


interface Item {
  title: string;
  description: string;
  price: number;
  image: string; // Path or URL to the image
  createdAt: string;
  createdBy: {
    name: string,
    id: string,
  }; 
}

const ItemList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
       
        const response = await fetch('http://localhost:8000/items', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setItems(data);
        } else {
          setError('Failed to load items.');
        }
      } catch (err) {
        setError('An error occurred while fetching items.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <p>Loading items...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container space-y-4 ">
      {items.length > 0 ? (
        items.map((item) => (
          <div key={item.title} className="border p-4 rounded">
            <h2 className="text-xl font-bold">{item.title}</h2>
            <p className='flex justify-end'>Uppladdat av: {item.createdBy.name}</p>
            <p>{item.description}</p>
            
            <p>Price: {item.price}kr</p>
            <p>
  Published on: {new Date(item.createdAt).toLocaleString('sv-SE', {
    weekday: 'long',   
    year: 'numeric',    
    month: 'long',      
    day: 'numeric',     
    hour: '2-digit',    
    minute: '2-digit',  
    
  })}
</p>
            {item.image && (
              <img src={`${item.image}`} alt={item.title} className="w-64 object-cover h-64 mt-2" />
            )}
          </div>
        ))
      ) : (
        <p>No items available.</p>
      )}
    </div>
  );
};

export default ItemList;
