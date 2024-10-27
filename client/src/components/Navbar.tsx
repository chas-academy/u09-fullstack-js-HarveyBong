import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { useLogout } from "../hooks/useLogout";

export default function Navbar() {
  const userContext = useContext(UserContext);
  const user = userContext?.user;

  const { logout } = useLogout();
  
  return (
    <nav className="flex items-center justify-between py-8 px-10 bg-slate-100 drop-shadow-md">
      <div className="flex items-center space-x-6">
        <Link to="/">Home</Link>
        <Link to="/publish">Publicera vara</Link>
        
        
        {user?.role === 'Admin' && (
          <Link to="/admin/adminpage" className="text-blue-600 font-bold">{user.name}</Link>
        )}

        {!user && <Link to="/register">Register</Link>}
      </div>
      
      {user ? (
        <div className="flex items-center space-x-4">
         
          {(user.role === 'Customer' || user.role === 'Expert') ? (
            <Link to="/dashboard">
              <span className="cursor-pointer font-bold">{user.name}</span>
            </Link>
          ) : (
            <span className="font-bold"></span>
          )}

          <button onClick={logout} className="ml-4">Logout</button>
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
}
