import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  createdAt: string;
  createdBy: {
    name: string;
    id: string;
  }; 
}

const ItemList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const navigate = useNavigate();

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

  const handleItemClick = (item: Item) => {
    console.log(`Item clicked with ID: ${item._id}`); 
    if (window.innerWidth <= 768) {
      navigate(`/items/${item._id}`); // Navigera till objektdetaljer på mobil
    } else {
      setSelectedItem(item); // Visa objektets detaljer på desktop
    }
  };

  if (loading) return <p>Loading items...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex space-x-4">
      <div className="w-1/2 container space-y-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item._id}
              className="border p-4 rounded hover:bg-slate-300 cursor-pointer"
              onClick={() => handleItemClick(item)} // Anropa handleItemClick med hela objektet
            >
              <h2 className="text-xl font-bold">{item.title}</h2>
              <p className="flex justify-end">Uppladdat av: {item.createdBy.name}</p>
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

      
      {window.innerWidth > 768 && selectedItem && (
        <div className="w-1/2 p-4 border">
          <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
          <p>{selectedItem.description}</p>
          <p>Pris: {selectedItem.price}kr</p>
          <p>Uppladdat av: {selectedItem.createdBy.name}</p>
          {selectedItem.image && (
            <img src={`${selectedItem.image}`} alt={selectedItem.title} className="w-64 object-cover h-64 mt-2" />
          )}
        </div>
      )}
    </div>
  );
};

export default ItemList;
