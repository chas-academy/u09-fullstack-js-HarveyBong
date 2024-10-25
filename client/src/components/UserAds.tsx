import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserAds: React.FC = () => {
  const [userAds, setUserAds] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAds = async () => {
      try {
        const response = await axios.get('http://localhost:8000/my-ads', {
          withCredentials: true,
        });
        if (response.status === 200) {
          setUserAds(response.data);
        } else {
          console.error('Failed to fetch user ads', response.status);
        }
      } catch (error) {
        console.error('Error fetching user ads', error);
      }
    };
    fetchUserAds();
  }, []);

  const handleDeleteAd = async (itemId: string) => {
    try {
      const response = await axios.delete(`http://localhost:8000/items/${itemId}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUserAds(prev => prev.filter(item => item._id !== itemId));
      } else {
        console.error('Failed to delete item', response.status);
      }
    } catch (err) {
      console.error('Error deleting item', err);
    }
  };

  const handleItemClick = (itemId: string) => {
    navigate(`/items/${itemId}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dina Annonser</h1>
      {userAds.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {userAds.map(item => (
            <div
              key={item._id}
              className="p-4 border shadow-sm cursor-pointer"
              onClick={() => handleItemClick(item._id)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Stoppa klicket från att navigera
                  handleDeleteAd(item._id);
                }}
                className="px-2 border border-red-600 rounded-md text-red-500 transition duration-300 hover:text-white hover:bg-red-600"
              >
                Delete
              </button>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <img className='w-20' src={`${item.image}`}></img>
            </div>
          ))}
        </div>
      ) : (
        <p>Du har inga annonser ännu.</p>
      )}
    </div>
  );
};

export default UserAds;
