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

        const response = await axios.get(`${import.meta.env.VITE_RENDER_URL}/api/admin/items`, {
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
          onClick: () => toast.error('Borttagning avbröts.'),
        },
      ],
    });
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_RENDER_URL}/api/admin/items/${itemId}`, {
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
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">Item Management</h2>

      {items.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item) => (
            <div key={item._id} className="border rounded p-4 bg-white shadow-md h-full flex flex-col justify-between">
              <p className="font-bold mb-2">Title: {item.title}</p>
              <p className="mb-2">Description: {item.description}</p>
              <p className="mb-2">Price: {item.price} kr</p>
              <p className="mb-2">Created By: {item.createdBy.name}</p>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-32 object-cover rounded mb-4"
                />
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => confirmDelete(item._id)}
                  className="bg-red-500 text-white py-1 px-2 rounded text-xs"
                >
                  Radera
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No items found.</p>
      )}
    </div>
  );
};

export default ItemManagement;
