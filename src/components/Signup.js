import React, { useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom'; 
import { useAuth } from '../contexts/AuthContexts'; 
import { auth, db } from '../firebase'; 

function Signup() {
    const [username, setUsername] = useState(""); 
    const displayNameRef = useRef(); 
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
        } else if (username.trim().length === 0) {
            return setError('Please enter a username');
        }

        try {
            setError(""); 
            setLoading(true); 
            await signup(emailRef.current.value, passwordRef.current.value, username, displayNameRef.current.value); 
            
            history.push('/dashboard'); 
        } catch {
            setError("Failed to create an account")
        }
        setLoading(false); 
    }

    function checkUsername(e) {
        e.preventDefault();
        if (username.trim().length === 0) {
            return setError('Please enter a username');
        } else {
            setError('');
            db.collection('usernames').doc(username).get().then(doc => {
                if (doc.exists) {
                    console.log('un taken'); 
                    return setError("Username has been taken!")   
                }
            })
        }
    }

    return (
        <div className='signup-login'>
            <div className='form-container'>
                <div className='header'><h2>Create an Account With Us!</h2></div>
                <div className='error'>{error && <p>{error}</p>}</div>
                <form className='signup-login-details' onSubmit={handleSubmit}>
                    <div className='signup-login-field'>
                        <div className='lab'><label id='displayName-label' for="displayName">Name</label></div>
                        
                        <div><input type='text' ref={displayNameRef} placeholder='Enter name' required></input></div>
                        <p>Name you would want us to refer you by!</p>
                    </div>
                    <div className='signup-login-field'>
                        <div className='lab'><label id='username-label' for="username">Username</label></div>
                        
                        <div><input type='text' placeholder='Enter username' onChange={e => setUsername(e.target.value)} required></input></div>
                    </div>
                    
                    <div className='signup-login-field'>
                        <div className='lab'><label id='email-label' for="email">Email</label></div>
                        
                        <div><input type='email' ref={emailRef} placeholder='Enter email' onClick={checkUsername} required></input></div>
                    </div>
                    <div className='signup-login-field'>
                        <div className='lab'><label id='password-label' for="password">Password</label></div>
                        
                        <div><input type='password' ref={passwordRef} placeholder='Enter password' required></input></div>
                    </div>
                    <div className='signup-login-field'>
                        <div className='lab'><label id='password-confirm-label' for="password-confirm">Confirm Password</label></div>
                        
                        <div><input type='password' ref={passwordConfirmRef} placeholder='Confirm password' required></input></div>
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
                    