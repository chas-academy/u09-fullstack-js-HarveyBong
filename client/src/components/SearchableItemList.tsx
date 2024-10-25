import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Item from '../interfaces/Item';
import { useNavigate } from 'react-router-dom';
import { AiOutlineStar, AiFillStar } from 'react-icons/ai';
import toast from 'react-hot-toast';

const SearchableItemList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [followedItems, setFollowedItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Hämta alla annonser från backend
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:8000/items', {
          withCredentials: true,
        });
        if (response.status === 200) {
          setItems(response.data);
          setFilteredItems(response.data);
        }
      } catch (error) {
        console.error('Error fetching items', error);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const fetchFollowedItems = async () => {
      try {
        const response = await axios.get('http://localhost:8000/followed', {
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

  // Filtrera annonser när användaren skriver i sökfältet
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredItems(items); // Om söktermen är tom, visa alla annonser
    } else {
      const filtered = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, items]);

  const handleFollow = async (itemId: string) => {
    try {
      const response = await axios.post(`http://localhost:8000/follow/${itemId}`, {}, {
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
      const response = await axios.post(`http://localhost:8000/unfollow/${itemId}`, {}, {
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

  const handleItemClick = (item: Item) => {
    console.log(`Item clicked with ID: ${item._id}`);
    if (window.innerWidth <= 768) {
      navigate(`/items/${item._id}`);
    } else {
      setSelectedItem(item);
    }
  };

  return (
    <div className=''>
      <div className=" container md:w-1/2 py-10 mt-10">
        <input
          type="text"
          placeholder="Sök efter annonser..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <div className="flex space-x-4">
        <div className="p-10 md:w-1/2 container space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
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
            <p className='text-center border-b-2 pb-10'>Inga annonser matchade din sökning.. vänligen titta på våra andra annonser nedan.</p>
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
    </div>
  );
};

export default SearchableItemList;
