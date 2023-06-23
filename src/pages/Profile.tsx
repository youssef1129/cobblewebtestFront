import React, { useEffect, useState } from 'react'
import { getToken } from '../functions/localStorage'
import { useNavigate } from 'react-router-dom'
import { axiosUri } from '../functions/axiosUri'
import { Iuser } from '../interfaces/Iclient'
import { Spinner } from '../components/Spinner'
import '../styles/profile.css'
import { Button, IconButton, Skeleton } from '@mui/material'
import { BiLogOut } from 'react-icons/bi'
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md'

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<Iuser>();
  const [isLoading, setIsLoading] = useState(false)

  const [currentIndex, setCurrentIndex] = useState(0);
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? user?.client[0].photo.length! - 1 : prevIndex - 1));
  };
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === user?.client[0].photo.length! - 1 ? 0 : prevIndex + 1));
  };

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
      {/* <button className='logout' onClick={()=>{localStorage.removeItem('token');navigate('/login')}}>logout</button> */}
      <Button style={{ position: 'absolute' }} onClick={() => { localStorage.removeItem('token'); navigate('/login') }} color='error' className='logout' variant="outlined" startIcon={<BiLogOut />}>
        Logout
      </Button>
      <nav>
        <img alt='logo' src={user?.client[0].avatar} />
        <label>{user?.firstname + ' ' + user?.lastname}</label>
      </nav>

      <div>
        <Button style={{placeSelf:'center'}} color='warning' disabled={currentIndex === 0} onClick={handlePrev} variant="contained" startIcon={<MdNavigateBefore />}>Prev</Button>
        <div id="imgCnt">
          {user?.client[0].photo.map((p, index) => (
            <img
              key={index}
              alt={p.name}
              src={p.url}
              style={{
                opacity: index === currentIndex ? 1 : 0,
                transform: index > currentIndex ? 'translateX(200%)' : (index < currentIndex ? 'translateX(-200%)' : 'translateX(0)'),
                transition: 'all 0.5s',
                filter: index === currentIndex ? 'blur(0)' : 'blur(4px)',
              }}
            />
          ))}
        </div>
        <Button style={{placeSelf:'center'}} color='warning' disabled={currentIndex === user?.client[0].photo.length! - 1} onClick={handleNext} variant="contained" startIcon={<MdNavigateNext />}>Next</Button>

      
      </div>

    </div>
  )
}

export default Profile