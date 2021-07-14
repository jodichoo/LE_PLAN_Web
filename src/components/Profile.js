import React, { useState, useEffect } from 'react'; 
import '../styles/Settings-profile.css'; 
import { Link, useHistory } from 'react-router-dom'; 
import { IoChevronBackOutline } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContexts';
import { db, auth } from '../firebase'; 
import Stonker from './Stonker';
import { BiJoystick, BiBriefcaseAlt2, BiTrash } from 'react-icons/bi'; 

function Profile() {
    const history = useHistory();
    const { currentUser } = useAuth(); 
    const userTasks = db.collection("users").doc(currentUser.uid);
    const [username, setUsername] = useState(''); 
    const [target, setTarget] = useState([0, 100]); 

    useEffect(() => {
        userTasks.get().then(doc => {
            setUsername(doc.data().username); 
            //get target
            setTarget(doc.data().targetWorkRange);
        });
    }, [])

    return (
        <div className='setting-profile-screen'>
            <div className='back' onClick={history.goBack}>
                <IoChevronBackOutline style={{fontSize: '20px'}}/>
                <text>Back</text>
            </div>
            
            <div className='profile-page-container'>
                <div className='profile'>
                <div className='header'>Profile</div>
                        <div className='profile-pic'>
                            <img style={{width: '100%', height: 'auto'}}
                                alt='oops, it broke'
                                src={currentUser.photoURL} 
                                onError={(e)=>{e.target.onError = null; 
                                    e.target.src="https://i.stack.imgur.com/l60Hf.png"}}/>
                        </div>

                        <div className='credentials'>
                            <div className='display'>{currentUser.displayName}</div>
                            <div className='profile-field'>
                                <div className='label'>Username:</div>
                                <div className='value'>{username}</div>
                            </div>
                            <div className='profile-field'>
                                <div className='label'>Email:</div> 
                                <div className='value'>{currentUser.email}</div>
                            </div>
                        </div>
                        {target === undefined 
                            ? <div style={{width: '80%', color: 'gray'}}>No target set yet, set a target range in the settings page!</div>
                            : <><div className='profile-field'>
                                <div className='label'><BiBriefcaseAlt2 />Target Work:</div> 
                            <div className='value'>{target[0]}%-{target[1]}%</div>
                            </div>
                        <div className='profile-field'>
                            <div className='label'><BiJoystick />Target Play:</div> 
                            <div className='value'>{100 - target[1]}%-{100-target[0]}%</div>
                        </div></>}
                    <br></br>
                    <div className='link'>
                        <Link style={{textDecoration: 'none', color: '#8a5858'}} to='/settings'>Edit Account Details</Link>
                    </div>
                </div>
                <Stonker /> 
            </div>
        </div>
    )
}

export default Profile;