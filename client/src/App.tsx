import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import axios from 'axios';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast';
import { UserContextProvider } from "../context/userContext";
import Dashboard from './pages/Dashboard';
import Publish from './pages/Publish';
import ProtectedRoute from './components/ProtectedRoute';
import ItemList from './components/ItemList'; 
import ItemDetails from './components/ItemDetails'; 

axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <UserContextProvider>
        <Navbar />
        <Toaster position='bottom-right' toastOptions={{ duration: 2000 }} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route
            path='/dashboard'
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path='/publish'
            element={
              <ProtectedRoute>
                <Publish />
              </ProtectedRoute>
            }
          />
          <Route path='/items' element={<ItemList />} />
          <Route path='/items/:id' element={<ItemDetails />} /> 
        </Routes>
      </UserContextProvider>
    </>
  );
}

export default App;