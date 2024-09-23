import { useContext } from "react"
import { Link } from "react-router-dom"
import { UserContext } from "../../context/userContext"
import { useLogout } from "../hooks/useLogout";

export default function Navbar() {
  const userContext = useContext(UserContext);
  const user = userContext?.user;

  const { logout } = useLogout();
  return (

    <nav className="flex items-center justify-between py-8  px-10 bg-slate-100 drop-shadow-md">
    <Link to='/'>Home</Link>
    <Link to='/publish'>Publicera vara</Link>
    {/* hide register button if user is logged in  */}
      {!user && <Link to="/register">Register</Link>}
    
    
    <Link to='/dashboard'>
    
    {user ? (
        <> <div className="flex flex-col">
          <span>{user.name}</span>
          <button onClick={logout} className="ml-4">Logout</button>
          </div>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    
    </Link>
    </nav>
  )
}
