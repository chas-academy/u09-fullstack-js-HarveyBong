import { useContext } from "react"
import { Link } from "react-router-dom"
import { UserContext } from "../../context/userContext"

export default function Navbar() {
  const userContext = useContext(UserContext);
  const user = userContext?.user;

  return (

    <nav>
    <Link to='/'>Home</Link>
    <Link to='/register'>Register</Link>
    <Link to='/login'>Login</Link>
    <Link to='/dashboard'>{ user ?
    <h1>{user.name}</h1>: <h1>guest</h1>}
    </Link>
    </nav>
  )
}
