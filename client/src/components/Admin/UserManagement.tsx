import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authorization token found.');
          setLoading(false);
          return;
        }
        const response = await axios.get('http://localhost:8000/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
          withCredentials: true,
        });

        if (response.status === 200) {
          setUsers(response.data);
        } else {
          setError('Failed to load users.');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('An error occurred while fetching users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const confirmDelete = (userId: string) => {
    confirmAlert({
      title: 'Bekräfta borttagning',
      message: 'Är du säker på att du vill ta bort denna användare?',
      buttons: [
        {
          label: 'Ja',
          onClick: () => handleDeleteUser(userId),
        },
        {
          label: 'Nej',
          onClick: () => toast('Borttagning avbröts.'),
        }
      ]
    });
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/admin/users/${userId}`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        toast.success('Användaren togs bort!');
      } else {
        toast.error('Misslyckades att ta bort användaren.');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Ett fel uppstod vid borttagning av användaren.');
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      {users.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Role</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center">
                <td className="border border-gray-300 p-2">{user.name}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">{user.role}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => confirmDelete(user._id)}
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
        <p>No users found.</p>
      )}
    </div>
  );
};

export default UserManagement;
