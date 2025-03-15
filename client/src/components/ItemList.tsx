import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineStar, AiFillStar } from 'react-icons/ai';
import axios from 'axios';
import toast from 'react-hot-toast';
import Item from '../interfaces/Item';

/*interface Item {
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
}*/

const ItemList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [followedItems, setFollowedItems] = useState<Item[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_RENDER_URL}/items`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setItems(response.data);
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

  useEffect(() => {
    const fetchFollowedItems = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_RENDER_URL}/followed`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setFollowedItems(response.data);
        } else {
          console.error('Failed to fetch followed items', response.status);
        }
      } catch (err) {
        console.error('Error fetching followed items', err);
      }
    };
    
    fetchFollowedItems();
  }, []);

  const handleItemClick = (item: Item) => {
    console.log(`Item clicked with ID: ${item._id}`); 
    if (window.innerWidth <= 768) {
      navigate(`/items/${item._id}`); 
    } else {
      setSelectedItem(item); 
    }
  };

  const handleFollow = async (itemId: string) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_RENDER_URL}/follow/${itemId}`, {}, {
        withCredentials: true,
      });
      if (response.status === 200) {
        const followedItem = items.find(item => item._id === itemId);
        if (followedItem) {
          setFollowedItems(prev => [...prev, followedItem]);
        }
        toast.success('Item followed successfully!');
      } else {
        console.error('Failed to follow item', response.status);
        toast.error('Failed to follow the item.');
      }
    } catch (err) {
      console.error('Error following item', err);
      toast.error('Failed to follow the item.');
    }
  };

  const handleUnfollow = async (itemId: string) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_RENDER_URL}/unfollow/${itemId}`, {}, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setFollowedItems(prev => prev.filter(item => item._id !== itemId));
        toast.success('Item unfollowed successfully!');
      } else {
        console.error('Failed to unfollow item', response.status);
        toast.error('Failed to unfollow the item.');
      }
    } catch (err) {
      console.error('Error unfollowing item', err);
      toast.error('Failed to unfollow the item.');
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
              onClick={() => handleItemClick(item)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (followedItems.some(followedItem => followedItem._id === item._id)) {
                    handleUnfollow(item._id);
                  } else {
                    handleFollow(item._id);
                  }
                }}
                className="ml-4"
              >
                {followedItems.some(followedItem => followedItem._id === item._id) ? (
                  <AiFillStar className="text-yellow-500" /> 
                ) : (
                  <AiOutlineStar className="text-gray-500" />
                )}
              </button>
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
