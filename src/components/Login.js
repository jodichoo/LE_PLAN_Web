import React, { useState, useRef } from 'react';
import '../styles/Signup-login.css'; 
import { useHistory } from 'react-router-dom'; 
import { useAuth } from '../contexts/AuthContexts'; 
import { Link } from 'react-router-dom'; 
import { BiArrowBack } from 'react-icons/bi';

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
            setError("Failed to log in, please check your email and password")
        }
        setLoading(false); 
    }

    return (
        <div className='signup-login'>
            <div className='form-container'>
                <div className='header'>Log in</div>
                {error && <div className='error'><p>{error}</p></div>}
                <form className='signup-login-details' onSubmit={handleSubmit}>
                    
                    <div className='field-container'>
                        <div className='signup-login-field'>
                            <div className='lab'><label id='email-label' for="email">Email</label></div>
                            <div className='in'><input type='email' ref={emailRef} placeholder='Enter email'></input></div>
                        </div>
                    </div>

                    <div className='field-container'>
                        <div className='signup-login-field'>
                            <div className='lab'><label id='password-label' for="password">Password</label></div>
                            <div className='in'><input type='password' ref={passwordRef} placeholder='Enter password'></input></div>
                        </div>
                    </div>
                    
                        <label className='enter-button' for='login-button'>
                        <button disabled={loading} type="submit" id='login-button'>Log In</button></label>
                </form>
                <div className='footer'>
                    Do not have an account? <Link to='/signup'>Sign up here</Link>
                    <br></br>
                    <Link to='/'>
                        <span style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', color: '#eddfc2'}}><BiArrowBack />Back to homepage</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Login; 