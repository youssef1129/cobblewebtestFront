import React, { useState } from 'react'
import Img from '../assets/log-in.png'
import '../styles/login.css'
import { Link, useNavigate } from 'react-router-dom'
import { Ilogin } from '../interfaces/Ilogin'
import { Spinner } from '../components/Spinner'
import { axiosUri } from '../functions/axiosUri'
import { setToken } from '../functions/localStorage'
const Login = () => {
    const [userLogin, setUserLogin] = useState<Ilogin>({ email: '', password: '' })
    const [validity, setValidity] = useState<{ name: boolean } | any>([]);
    const [error, setError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    const OnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserLogin({ ...userLogin, [name]: value })
        setValidity({ ...validity, [name]: e.target.checkValidity() });
    }

    const OnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true)
        await axiosUri.post('/login', userLogin).then((res) => {
            console.log(res);
            setToken(res.data.access_token)
            setIsLoading(false)
            navigate('/profile')
        })
            .catch((err) => {
                console.log(err);
                setError(true)
                setIsLoading(false)
            })
    }


    if (isLoading) {
        return <Spinner />
    }

    return (
        <div className='login'>
            <img alt='image' src={Img} />

            <form onSubmit={OnSubmit}>
                <h1>Login to you account</h1>
                {error && <label>Invalid email or password</label>}
                <input style={{ color: `${!validity.email ? 'red' : 'black'}` }} required pattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$' onChange={OnChange} placeholder='email' type='email' name='email' />
                <input style={{ color: `${!validity.password ? 'red' : 'black'}` }} required minLength={6} onChange={OnChange} placeholder='password' type='password' name='password' />
                <div>
                    <button type='submit'>Login</button>
                    <Link to={'/register'}>New? <span>Register</span></Link>
                </div>
            </form>
        </div>
    )
}

export default Login