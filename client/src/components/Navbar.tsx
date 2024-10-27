import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { useLogout } from "../hooks/useLogout";

export default function Navbar() {
  const userContext = useContext(UserContext);
  const user = userContext?.user;
  const { logout } = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-screen py-6 px-5 lg:px-64 bg-slate-100 flex justify-between text-neutral-800 drop-shadow-md">
      <span className="text-lg font-semibold">
        <Link to="/">Home</Link>
      </span>
      
      <ul className="hidden md:flex items-center space-x-5">
        
        <li>
          <Link to="/publish">Publicera vara</Link>
        </li>
        {user?.role === 'Admin' && (
          <li>
            <Link to="/admin/adminpage" className="text-blue-600 font-bold">Admin Panel</Link>
          </li>
        )}
        {!user && (
          <li>
            <Link to="/register">Register</Link>
          </li>
        )}
        {!user && (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
        {user && (
          <li>
            {(user.role === 'Customer' || user.role === 'Expert') ? (
              <Link to="/dashboard">
                <span className="cursor-pointer font-bold">{user.name}</span>
              </Link>
            ) : (
              <span className="font-bold"></span>
            )}
          </li>
        )}
        {user && (
          <li>
            <button onClick={logout} className="ml-4">Logout</button>
          </li>
        )}
      </ul>

      {/* hamburger menu */}
      <button 
        className="space-y-1 group md:hidden" 
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <div className="w-6 h-1 bg-black"></div>
        <div className="w-6 h-1 bg-black"></div>
        <div className="w-6 h-1 bg-black"></div>

        {/* menu */}
        {menuOpen && (
          <ul className="bg-slate-100 w-screen pb-10 absolute top-0 right-0 duration-150 flex flex-col space-y-3 justify-end">
            <button 
              className="px-10 py-8 relative ml-auto"
              onClick={() => setMenuOpen(false)}
            >
              <div className="w-6 h-1 rotate-45 absolute bg-black"></div>
              <div className="w-6 h-1 -rotate-45 absolute bg-black"></div>
            </button>
            
            <li className="flex justify-center w-full py-4 hover:bg-gray-200">
              <Link to="/publish" onClick={() => setMenuOpen(false)}>Publicera vara</Link>
            </li>
            {user?.role === 'Admin' && (
              <li className="flex justify-center w-full py-4 hover:bg-gray-200">
                <Link to="/admin/adminpage" className="text-blue-600 font-bold" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
              </li>
            )}
            {!user && (
              <li className="flex justify-center w-full py-4 hover:bg-gray-200">
                <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
              </li>
            )}
            {!user && (
              <li className="flex justify-center w-full py-4 hover:bg-gray-200">
                <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              </li>
            )}
            {user && (
              <li className="flex justify-center w-full py-4 hover:bg-gray-200">
                {(user.role === 'Customer' || user.role === 'Expert') ? (
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
                    <span className="cursor-pointer font-bold">{user.name}</span>
                  </Link>
                ) : (
                  <span className="font-bold"></span>
                )}
              </li>
            )}
            {user && (
              <li className="flex justify-center w-full py-4 hover:bg-gray-200">
                <button onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
              </li>
            )}
          </ul>
        )}
      </button>
    </div>
  );
}
