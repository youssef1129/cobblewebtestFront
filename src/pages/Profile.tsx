import React, { useEffect, useState } from 'react'
import { getToken } from '../functions/localStorage'
import { useNavigate } from 'react-router-dom'
import { axiosUri } from '../functions/axiosUri'
import { Iuser } from '../interfaces/Iclient'
import { Spinner } from '../components/Spinner'
import '../styles/profile.css'

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<Iuser>();
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
    setIsLoading(true)
    const token = getToken()
    !token && navigate('/login')
    checkClient(token!);
  }, [])


  const checkClient = async (token: string) => {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    await axiosUri.post('/users/me', {}, config).then((res) => {
      console.log(res);
      setUser(res.data)
      setIsLoading(false)
    })
      .catch((err) => {
        console.log(err);
        navigate('/login')
        setIsLoading(false)
      })
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className='profile'>
      <button className='logout' onClick={()=>{localStorage.removeItem('token');navigate('/login')}}>logout</button>
      <nav>
        <img alt='logo' src={user?.client[0].avatar} />
        <label>{user?.firstname + ' ' + user?.lastname}</label>
      </nav>

      <div>
        {
          user?.client[0].photo.map((p)=>{
            return <img alt={p.name} src={p.url} />
          })
        }
      </div>
    </div>
  )
}

export default Profile