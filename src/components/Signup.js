import React from 'react';
import { Link } from 'react-router-dom'; 


function Signup() {
    return (
        <div className='signup-login'>
            <h2>Create an Account With Us!</h2>
            <form className='signup-login-details'>
                <div className='signup-login-field'>
                    <label id='username-label' for="username">Username</label>
                    {' '}
                    <input type='email' placeholder='Enter username'></input>
                </div>
                <div className='signup-login-field'>
                    <label id='email-label' for="email">Email</label>
                    {' '}
                    <input type='email' placeholder='Enter email'></input>
                </div>
                <div className='signup-login-field'>
                    <label id='password-label' for="password">Password</label>
                    {' '}
                    <input type='password' placeholder='Enter password'></input>
                </div>
                <label className='enter-button' for='submit-button'>
                <button type="submit" id='submit-button'>Sign Up</button></label>
            </form>
            Already have an account? <Link to='/login'>Log In</Link>
        </div>
       
    )
}

export default Signup; 