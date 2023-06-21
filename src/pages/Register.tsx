import React, { useEffect, useState } from 'react'
import { Iregister } from '../interfaces/Iregister'
import { Link, useNavigate } from 'react-router-dom';
import { Spinner } from '../components/Spinner';
import '../styles/register.css'
import { CgProfile } from 'react-icons/cg'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { axiosUri } from '../functions/axiosUri';
import { setToken } from '../functions/localStorage';
import { Alert, Snackbar, TextField } from '@mui/material';

const Register = () => {
  const [userRegister, setUserRegister] = useState<Iregister>({ email: '', firstname: '', lastname: '', password: '', photos: [], role: 'client' })
  const [validity, setValidity] = useState<{ name: boolean } | any>([]);
  const [error, setError] = useState({ eror: false, title: '' })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();
  const [imgs, setImgs] = useState<Array<{ name: string, url: string }>>([])


  const OnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserRegister({ ...userRegister, [name]: value })
    setValidity({ ...validity, [name]: e.target.checkValidity() });

    name === 'password' && validateString(name, value, true)
    name === 'email' && validateString(name, value, false)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files!);
    const photos: Array<{ name: string, url: string }> = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          photos.push({ name: file.name, url: event.target.result.toString() })
          setImgs((p) => [...p, { name: file.name, url: event.target!.result!.toString() }])
        }
      };
      reader.readAsDataURL(file);
    });

    setUserRegister({ ...userRegister, photos: photos });
  }

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      var FR = new FileReader();
      FR.addEventListener("load", function (event: any) {
        const k = event.target.result;
        setUserRegister({ ...userRegister, avatar: k });
      });
      FR.readAsDataURL(e.target.files[0]);
    }

  }
  const OnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (imgs.length < 4) {
      setError({ eror: true, title: 'please provide more than 4 images' });
      setIsLoading(false)
      return;
    }
    setIsLoading(true)
    await axiosUri.post('/register', userRegister).then((res) => {
      console.log(res);
      if (res.data.message === "account already exist") {
        setError({ eror: true, title: 'email already exists' });
        setIsLoading(false)
        return;
      }
      setToken(res.data.access_token)
      setIsLoading(false)
      navigate('/profile')
    })
      .catch((err) => {
        console.log(err);
        setIsLoading(false)
        setError({ eror: true, title: 'Register eror' });
      })
  }

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setError({ eror: false, title: '' });
  };


  const validateString = (name: string, value: string, ispassword: boolean) => {
    const regex = ispassword ? /^(?=.*\d).{6,50}$/ : /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setValidity({ ...validity, [name]: regex.test(value) });
  }

  if (isLoading) {
    return <Spinner />
  }


  return (
    <>
      <Snackbar onClose={handleClose} color='danger' autoHideDuration={4000} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} open={error.eror} message='Invalid email or password' >
        <Alert style={{ backgroundColor: 'red', color: 'white' }} severity="error">{error.title}</Alert>
      </Snackbar>
      <div className='register'>
        <form onSubmit={OnSubmit}>
          <div>
            <AiOutlineCloudUpload />
            {userRegister.avatar ? <img alt='' src={userRegister.avatar} /> : <CgProfile />}
            <input onChange={onAvatarChange} id='file' type='file' accept="image/*" />
          </div>
          <TextField
            inputProps={{
              minLength: 2,
              maxLength: 25,
            }}
            helperText={validity.firstname === false && 'Please enter a valid First name'}
            color='warning' error={validity.firstname === false} label="First Name" type='text' required variant="standard" name='firstname' onChange={OnChange} />
          {/* <input onChange={OnChange} style={{ color: `${!validity.firstname ? 'red' : 'black'}` }} required minLength={2} placeholder='first name' type='text' name='firstname' /> */}
          <TextField
            inputProps={{
              minLength: 2,
              maxLength: 25,
            }}
            helperText={validity.lastname === false && 'Please enter a valid Last name'}
            color='warning' error={validity.lastname === false} label="Last Name" type='text' required variant="standard" name='lastname' onChange={OnChange} />
          {/* <input onChange={OnChange} style={{ color: `${!validity.lastname ? 'red' : 'black'}` }} required minLength={2} placeholder='last name' type='text' name='lastname' /> */}
          <TextField
            helperText={validity.email === false && 'Please enter a valid email'}
            color='warning' error={validity.email === false} label="Email" required variant="standard" name='email' onChange={OnChange} />
          {/* <input onChange={OnChange} style={{ color: `${!validity.email ? 'red' : 'black'}` }} required pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$' placeholder='email' type='email' name='email' /> */}
          <TextField
            helperText={validity.password === false && 'Please enter a valid password'}
            color='warning' error={validity.password === false} label="Password" type='password' required variant="standard" name='password' onChange={OnChange} />
          {/* <input onChange={OnChange} style={{ color: `${!validity.password ? 'red' : 'black'}` }} required minLength={6} placeholder='password' type='password' name='password' /> */}

          <label htmlFor="files" style={{ fontSize: '30px' }}><AiOutlineCloudUpload /></label>
          {
            userRegister.photos.length > 0 && <label>{userRegister.photos.length + ' photos uploaded'}</label>
          }
          <input required id='files' style={{ display: 'none' }} accept="image/*" multiple type='file' onChange={onFileChange} />
          <div className='imgCnt'>
            {
              imgs.length > 0 && imgs.map((i) => {
                return <img key={i.name} alt={i.name} src={i.url} />
              })
            }
          </div>
          <div>
            <button type='submit'>Register</button>
            <Link to={'/login'}>Have account? <span>Login</span></Link>
          </div>
        </form>
      </div>
    </>
  )
}

export default Register