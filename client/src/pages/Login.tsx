
import { useContext, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/userContext';


export default function Login() {
const navigate = useNavigate();
const { login } = useContext(UserContext) || { login: () => {} };;
  const [data, setData]=useState({
  
    email:'',
    password:'',
  })

const loginUser = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
const {email, password} = data;
try {
  const {data :responseData} = await axios.post('/login',{
    email,
    password,
  })
  console.log("Login response:", responseData);

  if(responseData.error){
  
    toast.error(responseData.error)
  } else{
    toast.success(`Login successful, welcome!` )
    console.log("navigate to dashboard bro", data)
    console.log('User logged in:', responseData)
    login(responseData); // Anropa login-funktionen
    setData({ email: '', password: '' });
    navigate('/dashboard');

  }
} catch (error) {
  console.error("Login error:", error); // Logga felet
  toast.error("An error occurred while logging in.");
  
}
}

  return (
    <div>
      <form onSubmit={loginUser}>
      <label>Email</label>
        <input type='email' placeholder='enter email...'value={data.email} onChange={(e)=> setData({...data,email: e.target.value})}/>
        <label>Password</label>
        <input type='password' placeholder='enter password...'value={data.password} onChange={(e)=> setData({...data,password: e.target.value})}/>
        <button type='submit'>Login</button>
        </form>
    </div>
  )
}
