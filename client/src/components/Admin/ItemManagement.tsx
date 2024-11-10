import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  createdBy: { name: string };
}

const ItemManagement: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Ingen token tillgänglig');
        }

        const response = await axios.get('https://u09-fullstack-js-harveybong.onrender.com/api/admin/items', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (response.status === 200) {
          setItems(response.data);
        } else {
          setError('Failed to load items.');
        }
      } catch (err) {
        setError('An error occurred while fetching items.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const confirmDelete = (itemId: string) => {
    confirmAlert({
      title: 'Bekräfta borttagning',
      message: 'Är du säker på att du vill ta bort denna annons?',
      buttons: [
        {
          label: 'Ja',
          onClick: () => handleDeleteItem(itemId),
        },
        {
          label: 'Nej',
          onClick: () => toast('Borttagning avbröts.'),
        }
      ]
    });
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const response = await axios.delete(`https://u09-fullstack-js-harveybong.onrender.com/api/admin/items/${itemId}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
        toast.success('Annonsen togs bort!');
      } else {
        toast.error('Misslyckades att ta bort annonsen.');
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      toast.error('Ett fel uppstod vid borttagning av annonsen.');
    }
  };

  if (loading) return <p>Loading items...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Item Management</h2>
      {items.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Title</th>
              <th className="border border-gray-300 p-2">Description</th>
              <th className="border border-gray-300 p-2">Price</th>
              <th className="border border-gray-300 p-2">Created By</th>
              <th className="border border-gray-300 p-2">Image</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="text-center">
                <td className="border border-gray-300 p-2">{item.title}</td>
                <td className="border border-gray-300 p-2">{item.description}</td>
                <td className="border border-gray-300 p-2">{item.price} kr</td>
                <td className="border border-gray-300 p-2">{item.createdBy.name}</td>
                <td className="border border-gray-300 p-2">
                  {item.image && (
                    <img src={item.image} alt={item.title} className="w-16 h-16 object-cover" />
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => confirmDelete(item._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Ta bort
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No items found.</p>
      )}
    </div>
  );
};

export default ItemManagement;
