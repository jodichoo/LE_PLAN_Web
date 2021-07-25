import React, { useRef, useState } from 'react';
import '../styles/Signup-login.css'; 
import { Link, useHistory } from 'react-router-dom'; 
import { useAuth } from '../contexts/AuthContexts'; 
import { auth, db } from '../firebase'; 
import { GoCheck, GoX } from 'react-icons/go'; 
import { BiArrowBack } from 'react-icons/bi';

function Signup() {
    const [username, setUsername] = useState(""); 
    const displayNameRef = useRef(); 
    const emailRef = useRef(); 
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup } = useAuth(); 
    const [error, setError] = useState(""); 
    const [loading, setLoading] = useState(false); 
    const [approveUn, setApproveUn] = useState(undefined); 
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
            await signup(emailRef.current.value, passwordRef.current.value, username.trim(), displayNameRef.current.value.trim()); 
            
            history.push('/dashboard'); 
        } catch {
            setError("Failed to create an account, try using another email")
        }
        setLoading(false); 
    }

    function checkUsername() {
        // e.preventDefault();
        const trimmedUn = username.trim(); 
        if (trimmedUn.length === 0) {
            setApproveUn(false); 
            return setError('Please enter a username');
        } else {
            setError('');
            db.collection('usernames').doc(trimmedUn).get().then(doc => {
                if (doc.exists) {
                    console.log('un taken'); 
                    setApproveUn(false); 
                    return setError("Username has been taken!")   
                } else {
                    setApproveUn(true); 
                }
            })
        }
    }

    const iconStyle = {
        alignSelf: ''
    }

    return (
        <div className='signup-login'>
            <div className='form-container'>
                <div className='header'>Create an account<br></br>with us!</div>
                {error && <div className='error'><p>{error}</p></div>}
                <form className='signup-login-details' onSubmit={handleSubmit}>

                    <div className='field-container'>
                        <div className='signup-login-field'>
                            <div className='lab'><label id='displayName-label' for="displayName">Name</label></div>
                            <div className='in'><input type='text' ref={displayNameRef} placeholder='Enter name' required></input></div>
                        </div>
                        <div className='caption'>
                            Name you would want us to refer you by!
                        </div>
                    </div>

                    <div className='field-container'>
                        <div className='signup-login-field'>
                            <div className='lab'>
                                <label id='username-label' for="username">Username</label>
                                { approveUn !== undefined && (approveUn ? <GoCheck style={iconStyle} /> : <GoX style={iconStyle} />)}
                            </div>
                            
                            <div className='in'><input type='text' placeholder='Enter username' onBlur={checkUsername} onChange={e => setUsername(e.target.value)} required></input></div>
                        </div>
                    </div>
                    
                    <div className='field-container'>
                        <div className='signup-login-field'>
                            <div className='lab'><label id='email-label' for="email">Email</label></div>
                            
                            <div className='in'><input type='email' ref={emailRef} placeholder='Enter email' required></input></div>
                        </div>
                    </div>

                    <div className='field-container'>
                        <div className='signup-login-field'>
                            <div className='lab'><label id='password-label' for="password">Password</label></div>
                            
                            <div className='in'><input type='password' ref={passwordRef} placeholder='Enter password' required></input></div>
                        </div>
                    </div>

                    <div className='field-container'>
                        <div className='signup-login-field'>
                            <div className='lab'><label id='password-confirm-label' for="password-confirm">Confirm Password</label></div>
                            
                            <div className='in'><input type='password' ref={passwordConfirmRef} placeholder='Confirm password' required></input></div>
                        </div>
                    </div>

                    
                    <label className='enter-button' for='submit-button'>
                    <button disable={loading} type="submit" id='submit-button'>Sign Up</button></label>
                </form>
                <div className='footer'>
                    Already have an account? <Link to='/login'>Log In</Link>
                    <br></br>
                    <Link to='/'>
                        <span style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', color: '#eddfc2'}}><BiArrowBack />Back to homepage</span>
                    </Link>
                </div>
                
            </div>
            
        </div>
       
    )
}

export default Signup; 
                    