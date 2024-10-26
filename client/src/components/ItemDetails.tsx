import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import toast from 'react-hot-toast';
import Item from '../interfaces/Item';


const ItemDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [offerPrice, setOfferPrice] = useState<number>(0);
  const [offerMessage, setOfferMessage] = useState<string>('');
  const [isSendingOffer, setIsSendingOffer] = useState(false);
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await fetch(`http://localhost:8000/items/${id}`);
        if (response.ok) {
          const data = await response.json();
          setItem(data);
        } else {
          setError('Failed to load item details.');
        }
      } catch (err) {
        setError('An error occurred while fetching item details.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  const handleBackClick = () => {
    navigate('/'); // Navigera tillbaka till hemsidan
  };

  const handleSendOffer = async () => {
    if (isSendingOffer) return; // Förhindra flera klick
    setIsSendingOffer(true);
  
    try {
      if (userContext?.user?.role !== 'Expert') {
        toast.error('Endast experter kan skicka offerter.');
        return;
      }
  
      // Kontrollera att värden för message och price är satta
      if (offerMessage.trim() === '' || offerPrice <= 0) {
        toast.error('Ange ett giltigt pris och meddelande.');
        return;
      }
  
      const response = await axios.post(
        'http://localhost:8000/api/offers',
        {
          itemId: item?._id,
          amount: offerPrice,
          message: offerMessage,
        },
        { withCredentials: true }
      );
  
      if (response.status === 201) {
        toast.success('Offert skickad!');
      } else {
        console.error('Error:', response.status);
        toast.error('Misslyckades med att skicka offert.');
      }
    } catch (error) {
      console.error('Error sending offer:', error);
      toast.error('Misslyckades med att skicka offert.');
    } finally {
      setIsSendingOffer(false);
    }
  };

  if (loading) return <p>Loading item details...</p>;
  if (error) return <p>{error}</p>;

  return item ? (
    <div>
      <button onClick={handleBackClick} className="m-4 p-4 bg-blue-500 text-white rounded">
        <IoIosArrowBack />
      </button>
      <h1>{item.title}</h1>
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
      <p>Uploaded by: {item.createdBy.name}</p>
      {item.image && <img src={item.image} alt={item.title} />}

      {/* Offer form */}
      <div className="mt-4">
        <input
          type="number"
          placeholder="Ange offertpris"
          onChange={(e) => setOfferPrice(Number(e.target.value))}
          className="p-2 border border-gray-300 text-black rounded w-full mt-2"
        />
        <textarea
          placeholder="Skriv meddelande för din offert"
          value={offerMessage}
          onChange={(e) => setOfferMessage(e.target.value)}
          className="p-2 border border-gray-300 text-black rounded w-full mt-2"
        ></textarea>
      </div>

      <button
        onClick={handleSendOffer}
        className="bg-green-500 text-white p-2 rounded-md mt-4"
        disabled={isSendingOffer}
      >
        {isSendingOffer ? 'Skickar...' : 'Skicka offert'}
      </button>
    </div>
  ) : (
    <p>No item found.</p>
  );
};

export default ItemDetails;
