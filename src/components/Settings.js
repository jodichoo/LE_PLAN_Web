import React, { useState, useEffect } from 'react'; 
import { useAuth } from '../contexts/AuthContexts';
import { db, auth } from '../firebase'; 
import { Link, useHistory } from 'react-router-dom'; 
import firebase from 'firebase/app'; 
import { IoChevronBackOutline } from 'react-icons/io5'; 

function Settings() {
    const history = useHistory();
    const { currentUser } = useAuth(); 
    const userTasks = db.collection("users").doc(currentUser.uid);
    const [username, setUsername] = useState(''); 
    const [changePass, setChangePass] = useState(false);
    const [confirmPassP, setConfirmPassP] = useState(false);
    const [confirmPassN, setConfirmPassN] = useState(false);
    const [oldPassword, setOldPassword] = useState(''); 
    const [newPassword, setNewPassword] = useState(''); 
    const [confPassword, setConfPassword] = useState(''); 
    const [error, setError] = useState(''); 
    const [success, setSuccess] = useState(''); 
    const [changeName, setChangeName] = useState(false);
    const [newName, setNewName] = useState('');
    const [picUrl, setPicUrl] = useState(''); 
    
    useEffect(() => {
        userTasks.get().then(doc => setUsername(doc.data().username));
    }, []); 

    function handleSetProfilePic(e) {
        e.preventDefault(); 
        currentUser.updateProfile({
            photoURL: picUrl
        })
            .then(() => {
                setSuccess('Successfully changed profile picture!');
                setPicUrl('');
            })
            .catch(error => {
                setError('Failed to set profile picture, please check the image url');
            });
    }

    function handleChangePassword(e) {
        e.preventDefault(); 
        if (newPassword !== confPassword) {
            setError('Passwords do not match!');
        } else if (newPassword.length < 6 && confPassword.length < 6) {
            setError('Password must be at least 6 characters long');
        } else {
            setError('');
            currentUser.updatePassword(newPassword)
                .then(() => {
                setChangePass(false);
                setSuccess('Successfully changed password!')
                console.log('update successful'); 
                })
                .catch(error => {
                    setError('Failed to change password');
                }); 
        }
    }

    function handleChangeName(e) {
        e.preventDefault(); 
        currentUser.updateProfile({
            displayName: newName
        })
            .then(() => {
                setSuccess('Successfully changed display name!');
            })
            .catch(error => {
                setError('Failed to set profile picture, please check the image url');
            });
    }

    function toggleAuth() {
        return (
            <div className='edit'>
                <div className='edit-form'>
                    <div className='error'>{error && <p>{error}</p>}</div>
                    Confirm Current Password:
                    <form onSubmit={toggleUpdate}>
                    <input type='password' onChange={e => setOldPassword(e.target.value)} required/>
                    <button type='submit'>Submit</button>
                    </form>
                    <button onClick={() => {setError(''); setConfirmPassP(false); setConfirmPassN(false);}}>X</button>
                </div>
            </div>
        )
    }

    function toggleUpdate(e) {
        e.preventDefault(); 
        var credential = firebase.auth.EmailAuthProvider.credential(
            currentUser.email,
            oldPassword
        );
        
        // Prompt the user to re-provide their sign-in credentials
        currentUser.reauthenticateWithCredential(credential).then(function() {
        // User re-authenticated.
        confirmPassP ? setChangePass(true) : setChangeName(true);
        setConfirmPassP(false);
        setConfirmPassN(false);
        setError('');
        }).catch(function(error) {
        // An error happened.
        console.log('errorororor');
            setError('Failed to reauthenticate');
        });
    }

    const profilePicStyle = {
        height: '200px', 
        width: '250px', 
        borderRadius: '100px'
    }

    return (
        <div style={{width: '100%', height: '100vh', paddingTop: '40px'}}>
            <div className='back' onClick={history.goBack}><IoChevronBackOutline style={{fontSize: '20px'}}/><text>Back</text></div>
            <div>{success && <p>{success}</p>}</div>
            <img style= {profilePicStyle} src={currentUser.photoURL} onError={(e)=>{e.target.onError = null; e.target.src="https://i.stack.imgur.com/l60Hf.png"}}/>

            <p>Upload Profile Picture</p>
                <form onSubmit={handleSetProfilePic}>
                    <input type='text' value={picUrl} onChange={e => setPicUrl(e.target.value)} placeholder='e.g. pic.png, pic.jpg'required/>{' '}
                    <button type='submit'>Set Picture</button>
                </form>
            <p>Your Username: {username}</p>
            <p>Your Email: {currentUser.email}</p>
            <p className='toggle-reauth' onClick={() => setConfirmPassP(true)}>Change Password</p>
            <div className='error'>{(error && changePass) && <p>{error}</p>}</div>
            {confirmPassP && toggleAuth()}
            {changePass && <div>
                <form onSubmit={handleChangePassword}>
                New password:{' '}<input type='password' onChange={e => setNewPassword(e.target.value)} required></input>
                Confirm new password:{' '}<input type='password' onChange={e => setConfPassword(e.target.value)} required></input>
                <button type='submit'>Submit</button>
                </form>
                <button onClick={() => setChangePass(false)}>Cancel</button>
                </div>} 
            <p className='toggle-reauth' onClick={() => setConfirmPassN(true)}>Change Display Name</p>
            {confirmPassN && toggleAuth()}
            {changeName && <div>
                <form onSubmit={handleChangeName}>
                New Display Name:{' '}<input type='text' onChange={e => setNewName(e.target.value)} />
                <button type='submit'>Submit</button>
                </form>
                </div>}
        </div>
    )
}

export default Settings;