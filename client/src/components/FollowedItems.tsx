import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const FollowedItems: React.FC = () => {
  const [followedItems, setFollowedItems] = useState<any[]>([]);
  const navigate = useNavigate();

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
      } catch (error) {
        console.error('Error fetching followed items', error);
      }
    };
    fetchFollowedItems();
  }, []);

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

  const handleItemClick = (itemId: string) => {
    navigate(`/items/${itemId}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Följda Annonser</h1>
      {followedItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {followedItems.map(item => (
            <div
              key={item._id}
              className="p-4 border shadow-sm cursor-pointer"
              onClick={() => handleItemClick(item._id)}
            >
              <button
              
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleUnfollow(item._id);
                }}
                className="px-1 border border-red-600 rounded-md text-red-500  hover:text-white hover:bg-red-600"
              >
                Avfölj
              </button>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <img src={`${item.image}`} className='w-20'>{}</img>

            </div>
          ))}
        </div>
      ) : (
        <p>Du följer inga annonser än.</p>
      )}
    </div>
  );
};

export default FollowedItems;
