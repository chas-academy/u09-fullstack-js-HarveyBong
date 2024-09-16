import axios from 'axios'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function Register() {
const navigate = useNavigate()
  const [data,setData]=useState({
    name: '',
    email:'',
    password:'',
    role:'Customer',
  })

  const registerUser = async (e) => {
    e.preventDefault()

    const {name, email, password, role} = data

    console.log({ name, email, password, role });
    try {
      const {data} = await axios.post('/register', {
        name, email, password, role
      })

      if(data.error){
        toast.error(data.error)
        
      }
      else{
        setData({ name: '',
          email: '',
          password: '',
          role: 'Customer' })
        toast.success('Register successful, now try to login!')
        navigate('/login')
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div>
      <form onSubmit={registerUser}>
        <label>Name</label>
        <input type='text' placeholder='enter name...'value={data.name} onChange={(e)=> setData({...data,name: e.target.value})}/>
        <label>Email</label>
        <input type='email' placeholder='enter email...'value={data.email} onChange={(e)=> setData({...data,email: e.target.value})}/>
        <label>Password</label>
        <input type='password' placeholder='enter password...'value={data.password} onChange={(e)=> setData({...data,password: e.target.value})}/>
        <label>Typ av användare</label>
  
  <div>
    <label>
      <input 
        type='radio' 
        name='role' 
        value='Customer' 
        checked={data.role === 'Customer'} 
        onChange={(e) => setData({...data, role: e.target.value})}
      />
      Customer
    </label>
  </div>

  <div>
    <label>
      <input 
        type='radio' 
        name='role' 
        value='Expert' 
        checked={data.role === 'Expert'} 
        onChange={(e) => setData({...data, role: e.target.value})}
      />
      Expert
    </label>
  </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}
