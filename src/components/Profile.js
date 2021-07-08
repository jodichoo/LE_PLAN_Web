import React, { useState, useEffect } from 'react'; 
import { Link, useHistory } from 'react-router-dom'; 
import { IoChevronBackOutline } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContexts';
import { db, auth } from '../firebase'; 
import Stonker from './Stonker';

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
        });
        
    }, [])

    return (
        <div style={{width: '100%', height: '100vh', paddingTop: '40px'}}>
            <div className='back' onClick={history.goBack}>
                <IoChevronBackOutline style={{fontSize: '20px'}}/>
                <text>Back</text>
            </div>
            <div>
                <Link style={{textDecoration: 'none', color: 'black'}} to='/settings'>Edit Account Details</Link>
            </div>
            <div>
                <img className="profile-pic"
                    alt='oops, it broke'
                    src={currentUser.photoURL} 
                    onError={(e)=>{e.target.onError = null; 
                        e.target.src="https://i.stack.imgur.com/l60Hf.png"}}/>
                <div style={{fontSize:'40px'}}>{currentUser.displayName}</div>
                <div style={{color: 'grey'}}>Username: {username}</div>
                <div>{currentUser.email}</div>
                <div>Target Work: {target[0]}%-{target[1]}%</div>
                <div>Target Play: {100 - target[1]}%-{100-target[0]}%</div>
            </div>
            <Stonker /> 
        </div>
    )
}

export default Profile;