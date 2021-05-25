import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom'; 
import { useAuth } from '../contexts/AuthContexts'; 
import { Link } from 'react-router-dom'; 

function Login() {
    const emailRef = useRef(); 
    const passwordRef = useRef();
    const { login } = useAuth(); 
    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false); 
    const history = useHistory(); 

    async function handleSubmit(e) {
        e.preventDefault(); 

        try {
            setError(""); 
            setLoading(true); 
            await login(emailRef.current.value, passwordRef.current.value); 
            history.push('/dashboard'); 
        } catch {
            setError("Failed to log in")
        }
        setLoading(false); 
    }

    return (
        <div className='signup-login'>
            <h2>Log In:</h2>
            {error && <p>{error}</p>}
            <form className='signup-login-details' onSubmit={handleSubmit}>
                <div className='signup-login-field'>
                    <label id='email-label' for="email">Email</label>
                    {' '}
                    <input type='email' ref={emailRef} placeholder='Enter email'></input>
                </div>
                <div className='signup-login-field'>
                    <label id='password-label' for="password">Password</label>
                    {' '}
                    <input type='password' ref={passwordRef} placeholder='Enter password'></input>
                </div>
                <label className='enter-button' for='login-button'>
                <button disbled={loading} type="submit" id='login-button'>Log In</button></label>
            </form>
            Do not have an account? <Link to='/signup'>Sign up here</Link>
        </div>
    )
}

export default Login; 