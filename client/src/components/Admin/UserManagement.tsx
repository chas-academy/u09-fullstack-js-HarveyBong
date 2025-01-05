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
        },
      ],
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
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">User Management</h2>

      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 mb-6">
        <input
          type="text"
          placeholder="Namn"
          value={formState.name}
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
          required
          className="border p-2 rounded"
        />
        <input
          type="email"
          placeholder="E-post"
          value={formState.email}
          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
          required
          className="border p-2 rounded"
        />
        {!editMode && (
          <input
            type="password"
            placeholder="Lösenord"
            value={formState.password}
            onChange={(e) => setFormState({ ...formState, password: e.target.value })}
            required
            className="border p-2 rounded"
          />
        )}
        <select
          value={formState.role}
          onChange={(e) => setFormState({ ...formState, role: e.target.value })}
          required
          className="border p-2 rounded"
        >
          <option value="">Välj roll</option>
          <option value="Admin">Admin</option>
          <option value="Customer">Customer</option>
          <option value="Expert">Expert</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          {editMode ? 'Uppdatera' : 'Skapa'}
        </button>
      </form>

      {users.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {users.map((user) => (
            <div key={user._id} className="border rounded p-4 bg-white shadow-md">
              <p className="font-bold mb-2">Name: {user.name}</p>
              <p className="mb-2">Email: {user.email}</p>
              <p className="mb-4">Role: {user.role}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(user)}
                  className="bg-yellow-500 text-white py-1 px-2 rounded text-xs"
                >
                  Redigera
                </button>
                <button
                  onClick={() => confirmDelete(user._id)}
                  className="bg-red-500 text-white py-1 px-2 rounded text-xs"
                >
                  Radera
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default UserManagement;
