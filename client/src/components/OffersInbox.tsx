import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/userContext';
import { useContext } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const OffersInbox: React.FC = () => {
  const userContext = useContext(UserContext);
  const [offers, setOffers] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        if (!userContext?.user) return;

        const response = await axios.get(`https://u09-fullstack-js-harveybong.onrender.com/api/offers/user/${userContext.user._id}`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          console.log('Fetched offers:', response.data);
          setOffers(response.data);
        }
      } catch (error) {
        console.error('Error fetching offers:', error);
        toast.error('Misslyckades med att hämta offerter.');
      }
    };

    fetchOffers();
  }, [userContext]);

  const handleItemClick = (itemId: string) => {
    navigate(`/items/${itemId}`);
  };

  return (
    <div className='text-white'>
      <h1 className="text-3xl font-bold mb-4">Mottagna Offerter</h1>
      <div className=' overflow-auto'>
        {offers.length > 0 ? (
          offers.map((offer) => (
            <div key={offer._id} className=" p-4 rounded mb-4">
              <h2 className="text-xl font-bold">
                Offert från: {offer.user?.name ? offer.user.name : 'Okänd avsändare'}
              </h2>
              <p>Erbjudande pris: {offer.amount} kr</p>
              <p>Meddelande: {offer.message}</p>
              <p>Skickad: {new Date(offer.createdAt).toLocaleString('sv-SE')}</p>

              
              {offer.item && (
                
                
                <div>
                  
                  <img
                    src={offer.item.image}
                    alt={offer.item.title}
                    className="w-32 h-32 object-cover mt-4"
                  />
                  <button className='' onClick={()=> handleItemClick(offer.item._id)}>Gå till Annons</button>
                  <p className=" mt-2">Titel: {offer.item.title}</p>
                  <p className="mt-2">Beskrivning: {offer.item.description}</p>
                  <p className="mt-2">Pris: {offer.item.price} kr</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Inga mottagna offerter än.</p>
        )}
      </div>
    </div>
  );
};

export default OffersInbox;
