import { useContext, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext) || { login: () => {} };
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = data;
    setLoading(true);

    try {
      const { data: responseData } = await axios.post('/login', {
        email,
        password,
      });
      console.log("Login response:", responseData);

      if (responseData.error) {
        toast.error(responseData.error);
      } else {
        toast.success(`Inloggning lyckades, välkommen!`);

        if (responseData.token) {
          localStorage.setItem('token', responseData.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${responseData.token}`;
        }

        login(responseData.user);
        setData({ email: '', password: '' });

        if (responseData.user.role === 'Admin') {
          navigate('/admin/adminpage');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Ett fel uppstod vid inloggning.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md mx-2 p-10 space-y-6 bg-dark-gray rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-light-beige">Logga in på ditt konto</h2>
        <form onSubmit={loginUser} className="space-y-6">
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
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 font-semibold text-white bg-greenish-gray opacity-70 rounded-lg hover:opacity-100 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Loggar in...' : 'Logga in'}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-light-beige">
            Har du inget konto?{' '}
            <span
              onClick={() => navigate('/register')}
              className="text-blue-500 font-bold hover:underline cursor-pointer"
            >
              Registrera dig här
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
