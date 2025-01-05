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
  const [formState, setFormState] = useState({ name: '', email: '', password: '', role: '' });
  const [editMode, setEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authorization token found.');
          setLoading(false);
          return;
        }
        const response = await axios.get('https://u09-fullstack-js-harveybong.onrender.com/api/admin/users', {
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
      const response = await axios.delete(`https://u09-fullstack-js-harveybong.onrender.com/api/admin/users/${userId}`, {
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = editMode
      ? `https://u09-fullstack-js-harveybong.onrender.com/api/admin/users/${editUserId}`
      : `https://u09-fullstack-js-harveybong.onrender.com/api/admin/users`;

    const method = editMode ? 'PUT' : 'POST';

    try {
      const response = await axios({
        method,
        url,
        headers: { Authorization: `Bearer ${token}` },
        data: formState,
      });

      if (response.status === 201 || response.status === 200) {
        toast.success(`Användaren ${editMode ? 'uppdaterades' : 'skapades'}!`);
        setUsers((prevUsers) =>
          editMode
            ? prevUsers.map((user) =>
                user._id === editUserId ? response.data : user
              )
            : [...prevUsers, response.data]
        );
        setEditMode(false);
        setEditUserId(null);
        setFormState({ name: '', email: '', password: '', role: '' });
      }
    } catch (error) {
      toast.error('Ett fel uppstod vid operationen.');
    }
  };

  const handleEditClick = (user: User) => {
    setEditMode(true);
    setEditUserId(user._id);
    setFormState({ name: user.name, email: user.email, password: '', role: user.role });
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      <form onSubmit={handleFormSubmit} className="mb-6">
        <input
          type="text"
          placeholder="Namn"
          value={formState.name}
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
          required
          className="border p-2 mr-2"
        />
        <input
          type="email"
          placeholder="E-post"
          value={formState.email}
          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
          required
          className="border p-2 mr-2"
        />
        {!editMode && (
          <input
            type="password"
            placeholder="Lösenord"
            value={formState.password}
            onChange={(e) => setFormState({ ...formState, password: e.target.value })}
            required
            className="border p-2 mr-2"
          />
        )}
        <select
          value={formState.role}
          onChange={(e) => setFormState({ ...formState, role: e.target.value })}
          required
          className="border p-2 mr-2"
        >
          <option value="">Välj roll</option>
          <option value="Admin">Admin</option>
          <option value="Customer">Customer</option>
          <option value="Expert">Expert</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editMode ? 'Uppdatera' : 'Skapa'}
        </button>
      </form>

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
                    onClick={() => handleEditClick(user)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Redigera
                  </button>
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
