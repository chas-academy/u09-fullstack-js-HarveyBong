import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";

interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  createdAt: string;
  createdBy: { name: string };
}

const ItemDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
    </div>
  ) : (
    <p>No item found.</p>
  );
};

export default ItemDetails;