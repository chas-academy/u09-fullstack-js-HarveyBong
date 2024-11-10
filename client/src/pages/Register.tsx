import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Customer',
  });
  const [loading, setLoading] = useState(false);

  const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, email, password, role } = data;
    setLoading(true);

    try {
      const { data: responseData } = await axios.post('/register', {
        name,
        email,
        password,
        role,
      });

      if (responseData.error) {
        toast.error(responseData.error);
      } else {
        setData({ name: '', email: '', password: '', role: 'Customer' });
        toast.success('Registrering lyckades! Logga in nu.');
        navigate('/login');
      }
    } catch (error) {
      console.log(error);
      toast.error("Ett fel uppstod vid registreringen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md mx-2 p-10 space-y-6 bg-dark-gray rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-light-beige">Skapa ett konto</h2>
        <form onSubmit={registerUser} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-light-beige">Namn</label>
            <input
              type="text"
              placeholder="Ange ditt namn"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="w-full px-4 py-2 text-sm border border-greenish-gray rounded-lg focus:outline-none focus:ring focus:greenish-gray"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-light-beige">E-post</label>
            <input
              type="email"
              placeholder="Ange din e-post"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full px-4 py-2 text-sm border border-greenish-gray rounded-lg focus:outline-none focus:ring focus:greenish-gray"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-light-beige">Lösenord</label>
            <input
              type="password"
              placeholder="Ange ditt lösenord"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring focus:greenish-gray"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-light-beige">Typ av användare</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 text-light-beige">
                <input
                  type="radio"
                  name="role"
                  value="Customer"
                  checked={data.role === 'Customer'}
                  onChange={(e) => setData({ ...data, role: e.target.value })}
                  className="text-greenish-gray"
                />
                <span>Kund</span>
              </label>
              <label className="flex items-center space-x-2 text-light-beige">
                <input
                  type="radio"
                  name="role"
                  value="Expert"
                  checked={data.role === 'Expert'}
                  onChange={(e) => setData({ ...data, role: e.target.value })}
                  className="text-greenish-gray"
                />
                <span>Expert</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 font-semibold text-white bg-greenish-gray opacity-70 rounded-lg hover:opacity-100 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Registrerar...' : 'Registrera'}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-light-beige">
            Har du redan ett konto?{' '}
            <span
              onClick={() => navigate('/login')}
              className="text-blue-500 font-bold hover:underline cursor-pointer"
            >
              Logga in här
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
