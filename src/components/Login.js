import React from 'react';
import { Link } from 'react-router-dom'; 

function Login() {
    return (
        <div className='signup-login'>
            <h2>Log In:</h2>
            <form className='signup-login-details'>
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
                <label className='enter-button' for='login-button'>
                <button type="submit" id='login-button'>Log In</button></label>
            </form>
            Do not have an account? <Link to='/signup'>Sign up here</Link>
        </div>
    )
}

export default Login; 