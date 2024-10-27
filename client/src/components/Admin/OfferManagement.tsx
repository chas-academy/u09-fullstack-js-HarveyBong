import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Offer {
  _id: string;
  item: { title: string; image?: string };
  user: { name: string };
  amount: number;
  message: string;
  createdAt: string;
}

const OfferManagement: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/offers', {
          withCredentials: true,
        });
        if (response.status === 200) {
          setOffers(response.data);
        } else {
          setError('Failed to load offers.');
        }
      } catch (err) {
        setError('An error occurred while fetching offers.');
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleDeleteOffer = async (offerId: string) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/offers/${offerId}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setOffers((prevOffers) => prevOffers.filter((offer) => offer._id !== offerId));
        toast.success('Offer deleted successfully.');
      } else {
        toast.error('Failed to delete offer.');
      }
    } catch (err) {
      console.error('Error deleting offer:', err);
      toast.error('An error occurred while deleting the offer.');
    }
  };

  if (loading) return <p>Loading offers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Offer Management</h2>
      {offers.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Item</th>
              <th className="border border-gray-300 p-2">Offered By</th>
              <th className="border border-gray-300 p-2">Amount</th>
              <th className="border border-gray-300 p-2">Message</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer._id} className="text-center">
                <td className="border border-gray-300 p-2">
                  {offer.item.title}
                  {offer.item.image && (
                    <img src={offer.item.image} alt={offer.item.title} className="w-16 h-16 object-cover mt-2" />
                  )}
                </td>
                <td className="border border-gray-300 p-2">{offer.user.name}</td>
                <td className="border border-gray-300 p-2">{offer.amount} kr</td>
                <td className="border border-gray-300 p-2">{offer.message}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleDeleteOffer(offer._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No offers found.</p>
      )}
    </div>
  );
};

export default OfferManagement;
