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
    <div className=" py-6 px-5  bg-dark-black flex justify-between fixed top-0 left-0 z-50 right-0  text-light-beige drop-shadow-md">
      <span className="text-3xl font-semibold">
        <Link to="/">Antiq</Link>
      </span>
      
      <ul className="hidden md:flex items-center space-x-10 ">
        
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
                <div className="grid col-span-1 text-center items-center">
                <span className="cursor-pointer font-bold">{user.name}</span>
                <span className=" cursor-pointer font-thin">"{user.role}"</span>
                </div>
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
        <div className="w-6 h-1 bg-light-beige"></div>
        <div className="w-6 h-1 bg-light-beige"></div>
        <div className="w-6 h-1 bg-light-beige"></div>
        
        

        {/* menu */}
        {menuOpen && (
          <ul className="bg-dark-black w-screen pb-10 absolute top-0 right-0 duration-150 flex flex-col space-y-3 justify-end">
            <button 
              className="px-10 py-8 relative ml-auto"
              onClick={() => setMenuOpen(false)}
            >
              <div className="w-6 h-1 rotate-45 absolute bg-light-beige"></div>
              <div className="w-6 h-1 -rotate-45 absolute bg-light-beige"></div>
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
