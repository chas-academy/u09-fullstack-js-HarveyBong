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
    <Link to='/register'>Register</Link>
    <Link to='/login'>Login</Link>
    
    <Link to='/dashboard'>{ user ?
    <h1>{user.name}</h1> : <h1>guest</h1>
  }
    
    <button onClick={logout}>Logout</button>
    </Link>
    </nav>
  )
}
