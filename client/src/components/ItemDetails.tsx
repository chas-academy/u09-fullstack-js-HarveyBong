import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import axios from 'axios';
import toast from 'react-hot-toast';
import { UserContext } from '../../context/userContext';
import Item from '../interfaces/Item';

interface ItemDetailsProps {
  item?: Item; // Gör item valfri för att kunna använda antingen prop eller URL-param
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ item: propItem }) => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(propItem || null);
  const [loading, setLoading] = useState<boolean>(!propItem);
  const [error, setError] = useState<string | null>(null);
  const [offerPrice, setOfferPrice] = useState<number>(0);
  const [offerMessage, setOfferMessage] = useState<string>('');
  const [isSendingOffer, setIsSendingOffer] = useState(false);
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Hämta data endast om item inte skickades som prop
    if (!propItem && id) {
      const fetchItem = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_RENDER_URL}/items/${id}`);
          if (response.status === 200) {
            setItem(response.data);
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
    }
  }, [id, propItem]);

  const handleBackClick = () => {
    navigate(-1); 
  };

  const handleSendOffer = async () => {
    if (isSendingOffer) return; // Förhindra flera klick
    setIsSendingOffer(true);

    try {
      if (userContext?.user?.role !== 'Expert') {
        toast.error('Endast experter kan skicka offerter.');
        return;
      }

      if (offerMessage.trim() === '' || offerPrice <= 0) {
        toast.error('Ange ett giltigt pris och meddelande.');
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_RENDER_URL}/api/offers`,
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
    <div className="p-4 border rounded-lg shadow-md md:container md:my-20">
      <button onClick={handleBackClick} className="md:hidden mb-4 px-4 py-2 bg-dark-gray text-white rounded-md flex items-center">
        <IoIosArrowBack className="mr-2" /> Tillbaka
      </button>
      <div className='md:grid-cols-2 grid gap-2'>
      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          className="md:w-64 w-screen object-cover rounded-md"
        />
      )}
        <div>
          
      <h2 className="text-2xl font-bold">{item.title}</h2>
      
      
      <span className="text-lg font-semibold">Köpt för: {item.price.toLocaleString()} kr</span>
     
      <p>Uppladdat av: {item.createdBy.name}</p>
      <p>
        {new Date(item.createdAt).toLocaleString('sv-SE', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
      </div>
      </div>
     

      <div className="flex items-start mt-4">
  <p className="font-bold mr-1">Beskrivning:</p>
  <span className="font-normal">{item.description}</span>
</div>

      {/* Offer form */}
      <div className="mt-4 ">
        <input
          type="number"
          placeholder="Ange offertpris (kr)"
          onChange={(e) => setOfferPrice(Number(e.target.value))}
          className="p-2 border border-gray-300 text-black rounded w-full"
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
        className="bg-dark-gray text-white p-2 rounded-md mt-4 w-full md:w-1/2"
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
