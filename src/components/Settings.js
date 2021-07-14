import React, { useState, useEffect } from 'react'; 
import '../styles/Settings-profile.css'; 
import { useAuth } from '../contexts/AuthContexts';
import { db, auth } from '../firebase'; 
import { useHistory } from 'react-router-dom'; 
import firebase from 'firebase/app'; 
import { IoChevronBackOutline, IoClose } from 'react-icons/io5';
import { GoCheck, GoX } from 'react-icons/go'; 
import TargetPicker from './TargetPicker';

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
    const [range, setRange] = useState([25, 75]); 
    
    useEffect(() => {
        userTasks.get().then(doc => setUsername(doc.data().username));
        userTasks.get().then(doc => {
            setUsername(doc.data().username);
            if (doc.data().targetWorkRange !== undefined) {
                setRange(doc.data().targetWorkRange);
            }
        });
    }, []); 

    function handleSetProfilePic(e) {
        e.preventDefault(); 
        var image = new Image();
        image.src = picUrl;

        image.onload = function() {
          if (this.width > 0) {
            //the image exists, so update profile picture
            currentUser.updateProfile({
                photoURL: picUrl
            })
                .then(() => {
                    // setError(''); 
                    // setSuccess('Successfully changed profile picture!');
                    // setPicUrl('');
                    userTasks.update({
                        photoURL: picUrl 
                    }).then(() => {
                        setError(''); 
                        setSuccess('Successfully changed profile picture!');
                        setPicUrl('');
                    })
                })
                .catch(error => {
                    setError('Failed to set profile picture, please try again');
                });
          }
        }

        image.onerror = function() {
          //image does not exist, set an error 
          return setError('The image does not exist, please check the url');
        }
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
                userTasks.update({
                    displayName: newName
                }).then(() => { 
                    setSuccess('Successfully changed display name!');
                }).then(() => {
                    setChangeName(false); 
                })
            })
            .catch(error => {
                setError('Failed to set display name, please try again');
            });
    }

    function toggleAuth() {
        return (
            <div className='edit'>
                <div className='edit-form'>
                    <div className='exit'><IoClose style={{fontSize: '20px', cursor: 'pointer'}} onClick={() => {setError(''); setConfirmPassP(false); setConfirmPassN(false);}}/></div>
                    <div className='reauth'>
                        {error && renderNotif(error)}
                        <div className='label'>Confirm Current Password:</div>
                        <form onSubmit={toggleUpdate}>
                        <input type='password' onChange={e => setOldPassword(e.target.value)} required/>{' '}
                        <button type='submit'>Submit</button>
                        </form>
                    </div>
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

    function handleSetTarget() {
        // console.log('set target', range);
        userTasks
            .set({
                targetWorkRange: range
            }, { merge: true})
            .then(() => {
                setSuccess('Successfully changed target range');
            });
    }

    function renderNotif(t) {
        const icon = t === success 
            ? <GoCheck style={{fontSize: '22px', color: 'green'}} />
            : <GoX style={{fontSize: '22px', color: 'red'}} />
        return (<div className='notif'>
                    <div>{icon}</div>
                    <div>{t}</div>
                </div>);
    }

    return (
        <div className='setting-profile-screen'>
            <div className='back' onClick={history.goBack}><IoChevronBackOutline style={{fontSize: '20px'}}/>Back</div>

            <div className='settings-container'>
                <div className='header'>Settings</div>
                {success && renderNotif(success)}
                <div className='profile-pic'>
                    <img style={{width: '100%', height: 'auto'}} src={currentUser.photoURL} onError={(e)=>{e.target.onError = null; e.target.src="https://i.stack.imgur.com/l60Hf.png"}}/>
                </div>

                <div className='display-name'>{currentUser.displayName}</div>

                <div className='upload-pic'>
                    Upload Profile Picture
                    {(error && !changePass) && renderNotif(error)}
                    <form onSubmit={handleSetProfilePic}>
                        <input type='text' value={picUrl} onChange={e => setPicUrl(e.target.value)} placeholder='e.g. pic.png, pic.jpg'required/>{' '}
                        <button type='submit'>Set Picture</button>
                    </form>
                </div>
                    <div style={{width: '100%', marginBottom: '40px'}}>
                        Set Target Work Range: 
                        <div style={{display: 'flex', flexDirection: 'row', width: '100%', marginTop: '5px', alignItems: 'center'}}>
                        <TargetPicker range={range} setRange={setRange}/>
                        <div style={{flex: 0.2}}><button onClick={handleSetTarget}>Set</button></div>
                        </div>
                    </div>
                

                <div className='credentials'>
                    <div className='profile-field'>
                        <div className='label'>Your Username:</div>
                        <div className='value'>{username}</div>
                    </div>
                    <div className='profile-field'>
                        <div className='label'>Your Email:</div>
                        <div className='value'>{currentUser.email}</div>
                    </div>
                </div>
                
                <div className='toggle-reauth' onClick={() => {setConfirmPassP(true); setError('')}}>Change Password</div>
                {(error && changePass) && renderNotif(error)}
                {confirmPassP && toggleAuth()}
                {changePass && <div className='settings-form'>
                        <form onSubmit={handleChangePassword}>
                            <div className='form-field'>New password:{' '}<input type='password' onChange={e => setNewPassword(e.target.value)} required></input></div>
                            <div className='form-field'>Confirm new password:{' '}<input type='password' onChange={e => setConfPassword(e.target.value)} required></input></div>
                            <div className='form-buttons'>
                                <button type='submit'>Submit</button>{' '}
                                <button onClick={() => {setChangePass(false); setError('')}}>Cancel</button>
                            </div>
                        </form>
                    </div>} 
                <div className='toggle-reauth' onClick={() => {setConfirmPassN(true); setError('')}}>Change Display Name</div>
                {confirmPassN && toggleAuth()}
                {changeName && <div>
                    <form onSubmit={handleChangeName}>
                    New Display Name:{' '}<input type='text' onChange={e => setNewName(e.target.value)} />
                    <button type='submit'>Submit</button>
                    </form>
                    </div>}
            </div>
        </div>
    )
}

export default Settings;