import React, { useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom'; 
import { useAuth } from '../contexts/AuthContexts'; 


function Signup() {
    const usernameRef = useRef(); 
    const emailRef = useRef(); 
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup } = useAuth(); 
    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false); 
    const history = useHistory(); 

    async function handleSubmit(e) {
        e.preventDefault(); 

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
           return setError("Passwords do not match!");  
        } else if (passwordRef.current.value.length < 6) {
            return setError("Password must be at least 6 characters long");  
        }

        try {
            setError(""); 
            setLoading(true); 
            await signup(emailRef.current.value, passwordRef.current.value, usernameRef.current.value); 
            history.push('/dashboard'); 
        } catch {
            setError("Failed to create an account")
        }
        setLoading(false); 
    }

    return (
        <div className='signup-login'>
            <div className='form-container'>
                <div className='header'><h2>Create an Account With Us!</h2></div>
                <div className='error'>{error && <p>{error}</p>}</div>
                <form className='signup-login-details' onSubmit={handleSubmit}>
                    <div className='signup-login-field'>
                        <div className='lab'><label id='username-label' for="username">Username</label></div>
                        
                        <div><input type='text' ref={usernameRef} placeholder='Enter username'></input></div>
                    </div>
                    <div className='signup-login-field'>
                        <div className='lab'><label id='email-label' for="email">Email</label></div>
                        
                        <div><input type='email' ref={emailRef} placeholder='Enter email'></input></div>
                    </div>
                    <div className='signup-login-field'>
                        <div className='lab'><label id='password-label' for="password">Password</label></div>
                        
                        <div><input type='password' ref={passwordRef} placeholder='Enter password'></input></div>
                    </div>
                    <div className='signup-login-field'>
                        <div className='lab'><label id='password-confirm-label' for="password-confirm">Confirm Password</label></div>
                        
                        <div><input type='password' ref={passwordConfirmRef} placeholder='Confirm password'></input></div>
                    </div>
                    <label className='enter-button' for='submit-button'>
                    <button disable={loading} type="submit" id='submit-button'>Sign Up</button></label>
                </form>
                <div className='footer'>Already have an account? <Link to='/login'>Log In</Link></div>
                
            </div>
            
        </div>
       
    )
}

export default Signup; 
                    