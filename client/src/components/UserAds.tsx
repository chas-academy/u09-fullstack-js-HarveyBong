import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import toast from 'react-hot-toast';

const UserAds: React.FC = () => {
  const [userAds, setUserAds] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAds = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_RENDER_URL}/my-ads`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setUserAds(response.data);
        } else {
          console.error("Failed to fetch user ads", response.status);
        }
      } catch (error) {
        console.error("Error fetching user ads", error);
      }
    };
    fetchUserAds();
  }, []);

  const handleDeleteAd = async (itemId: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/items/${itemId}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setUserAds((prev) => prev.filter((item) => item._id !== itemId));
        toast.success("Annonsen togs bort!");
      } else {
        
        toast.error("Misslyckades att ta bort annonsen.");
      }
    } catch (err) {
      toast.error("Ett fel uppstod vid borttagning.");
    }
  };

  const confirmDelete = (itemId: string) => {
    confirmAlert({
      title: 'Bekräfta borttagning',
      message: 'Är du säker på att du vill ta bort denna annons?',
      buttons: [
        {
          label: 'Ja',
          onClick: () => handleDeleteAd(itemId),
        },
        {
          label: 'Nej',
          onClick: () => console.log('Borttagning avbröts'),
        }
      ]
    });
  };

  const handleItemClick = (itemId: string) => {
    navigate(`/items/${itemId}`);
  };

  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-4">Dina Annonser</h1>
      {userAds.length > 0 ? (
        <div className="grid grid-cols-1  bg-dark-black hover:bg-dark-black/90 rounded-md">
          {userAds.map((item) => (
            <div
              key={item._id}
              className="p-4 border-b  border-light-beige shadow-sm "
            >
              <div className="flex justify-between py-5">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Stoppa klicket från att navigera
                  confirmDelete(item._id);
                }}
                className="px-4 border border-red-600 rounded-md text-red-500 transition duration-300 hover:text-white hover:bg-red-600"
              >
                Delete
              </button>

              <button onClick={() => handleItemClick(item._id)}
                className="px-2 border border-blue-500 rounded-md text-blue-500 transition duration-300 hover:text-white hover:bg-blue-500
                "
              >
                Gå till Annons
              </button>
              </div>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <img className="w-20" src={`${item.image}`} alt={item.title}></img>
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
