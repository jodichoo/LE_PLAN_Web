import { db } from "../firebase";
import { useAuth } from '../contexts/AuthContexts'; 

function FriendProfile(props) {
    const { currentUser } = useAuth(); 
    const { selected, setSelected, renderMeter, setFriendsList, setFriendData, friendsList, friendData } = props; 
    const userTasks = db.collection('users').doc(currentUser.uid); 

    function handleDeleteFriend() {
        const index = friendsList.findIndex(element => element === selected.friend); 
        var newList; 
        var newData; 
        if (index === 0) {
            //friend is first in list
            newList = [...friendsList.slice(1)]; 
            newData = [...friendsList.slice(1)]; 
        } else {
            newList = [...friendsList.slice(0, index), ...friendsList.slice(index + 1)];
            newData = [...friendData.slice(0, index), ...friendData.slice(index + 1)];
        }
        userTasks.update({
          friends: newList
        })
          .then(() => {
            setSelected(undefined); 
            setFriendsList(newList); 
            setFriendData(newData); 
          });
    }

    return (
        selected !== undefined && 
            <div className='friend-profile'>
                <div className='friend-img'>
                    <img style={{width: '100%', height: 'auto'}} src={selected.pic} alt='oops, it broke' onError={(e)=>{e.target.onError = null; 
                                    e.target.src="https://i.stack.imgur.com/l60Hf.png"}}></img>
                </div>
                <div className='friend-display-name'>
                    {selected.displayName}
                </div>
                <div style={{fontStyle: 'italic', fontWeight: '300'}}>
                    {selected.bio}
                </div>
                <div className='friend-un'>
                    un: {selected.friend}
                </div>
                <div className='meter-container'>
                    {renderMeter(selected.work, selected.play)}
                </div>
                <div className='delete' onClick={handleDeleteFriend}>
                    Delete Friend இдஇ
                </div>
            </div>
    )
}

export default FriendProfile; 