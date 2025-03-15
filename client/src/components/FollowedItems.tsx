import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const FollowedItems: React.FC = () => {
  const [followedItems, setFollowedItems] = useState<any[]>([]);
  const navigate = useNavigate();

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
      } catch (error) {
        console.error('Error fetching followed items', error);
      }
    };
    fetchFollowedItems();
  }, []);

  const handleUnfollow = async (itemId: string) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_RENDER_URL}/unfollow/${itemId}`, {}, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setFollowedItems(prev => prev.filter(item => item._id !== itemId));
        toast.success('Annonsen avföljdes!');
      } else {
        toast.error('Misslyckades att avfölja annonsen.');
      }
    } catch (err) {
      toast.error('Ett fel uppstod vid avföljning.');
    }
  };

  const confirmUnfollow = (itemId: string) => {
    confirmAlert({
      title: 'Bekräfta avföljning',
      message: 'Är du säker på att du vill avfölja denna annons?',
      buttons: [
        {
          label: 'Ja',
          onClick: () => handleUnfollow(itemId),
        },
        {
          label: 'Nej',
          onClick: () => toast('Avföljning avbröts.'),
        }
      ]
    });
  };

  const handleItemClick = (itemId: string) => {
    navigate(`/items/${itemId}`);
  };

  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-4">Följda Annonser</h1>
      {followedItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 bg-dark-black hover:bg-dark-black/90 rounded-md">
          {followedItems.map(item => (
            <div
              key={item._id}
              className="p-4 border-b border-light-beige shadow-sm"
            >
              <div className="flex justify-between py-5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmUnfollow(item._id);
                  }}
                  className="px-4 border border-red-600 rounded-md text-red-500 transition duration-300 hover:text-white hover:bg-red-600"
                >
                  Avfölj
                </button>
                <button
                  onClick={() => handleItemClick(item._id)}
                  className="px-2 border border-blue-500 rounded-md text-blue-500 transition duration-300 hover:text-white hover:bg-blue-500"
                >
                  Gå till Annons
                </button>
              </div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <img src={`${item.image}`} alt={item.title} className="w-20" />
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
