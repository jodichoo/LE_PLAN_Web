import moment from "moment";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from '../contexts/AuthContexts'; 
import { HiUserAdd } from 'react-icons/hi';
import { BiTrash } from 'react-icons/bi'; 
import ReactTooltip from 'react-tooltip';

function Friends(props) {
  const { currentUser } = useAuth(); 
  const [friendsUn, setFriendsUn] = useState(''); 
  const [error, setError] = useState('');
  const userTasks = db.collection('users').doc(currentUser.uid);  
  const [currUn, setCurrUn] = useState(''); 
  const [friendsList, setFriendsList] = useState([]);
  const [addFriends, setAddFriends] = useState(false);
  const [friendData, setFriendData] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [showFriendDetails, setShowFriendDetails] = useState(undefined); 

  useEffect(() => {
    const dataList = []
    for (var i = 0; i < friendsList.length; i++) {
      const name = friendsList[i]; 
      db.collection('users').where('username', '==', name).get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            dataList.push({
              friend: name,
              work: doc.data().workTime, 
              play: doc.data().lifeTime
            })
          })
        })
        .then(() => {
          setLoading(true); 
          setFriendData(dataList); 
        }).then(() => setLoading(false))
    }
  }, [friendsList]); 

  useEffect(() => {
    userTasks.get().then((doc) => {
      setCurrUn(doc.data().username); 
      setFriendsList(doc.data().friends); 
    })
  }, []);

  function handleAddFriend(e) {
    e.preventDefault(); 
    if (friendsUn.trim().length === 0) {
      return setError('Please enter a username');
    } else if (friendsUn === currUn) {
      return setError("You are not your own friend >_<")
    } else if (friendsList.includes(friendsUn)) {
      return setError("This person is already your friend :)");
    } else {
      setError('');
      db.collection('usernames').doc(friendsUn).get().then(doc => {
          if (doc.exists) {
            //friend exists
            const currFriends = friendsList; 
            const newList = currFriends.concat(friendsUn); 
            userTasks.update({
              friends: newList
            }).then(() => {
              setFriendsList(newList)
            });
            return setError("")  
          } else {
            //friend does not exist
            return setError("Friend does not exist!")  
          }
      })
      setAddFriends(false);
    }
  }

  function renderMeter(w, p) {
    const wFlex = p === 0 ? 100 : w * 100 / p + w; 
    const pFlex = w === 0 ? 100 : p * 100 / p + w;

    const styles = {
      wrapper: {
        flex: '50%',
        display: 'flex', 
        flexDirection: 'row', 
        width: '100%',
        border: '1px solid whitesmoke'
      },
  
      work: {
        color: '#8a5858',
        height: '100%', 
        flex: `${wFlex}%`,
        backgroundColor: '#8a5858'
      },
      
      play: {
        color: '#eddfc2',
        height: '100%', 
        flex: `${pFlex}%`,
        backgroundColor: '#eddfc2'
      }
    };
  
    return (
      w === 0 && p === 0 
        ? <div style = {styles.wrapper}>Nothing :(</div>
        : w === 0
          ? <div style={styles.wrapper}>
              <div style={styles.play}>p</div>
            </div>
          : p === 0
            ? <div style={styles.wrapper}>
                <div style={styles.work}>w</div>
              </div> 
            : <div style={styles.wrapper}>
                <div style={styles.work}>w</div>
                <div style={styles.play}>p</div>
              </div>
    )
  }

  function toggleFriendDetails(n) {
    if (showFriendDetails === n) {
      setShowFriendDetails(undefined); 
    } else {
      setShowFriendDetails(n); 
    }
  }

  function handleDeleteFriend(friendObj) {
    const toDelete = friendObj.friend; 
    const index = friendsList.findIndex(element => element === toDelete); 
    const newList = [...friendsList.slice(0, index), ...friendsList.slice(index + 1)];
    const newData = [...friendData.slice(0, index), ...friendData.slice(index + 1)];
    userTasks.update({
      friends: newList
    })
      .then(() => {
        setFriendsList(newList); 
        setFriendData(newData); 
      });
  }

  function renderFriend(friendObj) {
    //function that decides whether to show the friend details
    function showDetails(name, cond) {
      if (cond === name) {
        return (
          <div>
            <div>W: {friendObj.work}h, P: {friendObj.play}h</div>
            <div style={{backgroundColor:'#8a5858', borderRadius:'6px', display:'flex', alignItems:'center', justifyContent:'space-evenly', cursor:'pointer'}} 
              onClick={() => handleDeleteFriend(friendObj)}>
                <BiTrash />Delete {name}
            </div>
          </div>
        )
      }
    }
    
    return (
      <>
      <div data-tip data-for='delete-friend' className='friend' style={{cursor: 'pointer'}} onClick={() => toggleFriendDetails(friendObj.friend)}>
        <div className='name'>{friendObj.friend}</div>
        {renderMeter(friendObj.work, friendObj.play)}
        {/* <p>{' '}{renderMeter(friendObj.work, friendObj.play)}</p> */}
        {/* {friendObj.work}/{friendObj.play} */}
        
      </div>
      <ReactTooltip id='delete-friend' type='dark' effect="solid"><span>Click to remove friend இдஇ</span></ReactTooltip>
      {showDetails(friendObj.friend, showFriendDetails)}
      </>
    )
  }

function showAddFriend(e) {
  e.preventDefault();
  setAddFriends(!addFriends);
}

  return (
    <div className="left-dash">
      {/* <button onClick={showAddFriend}>+ Add Friends</button> */}
      <div className='add-friend-button' onClick={showAddFriend}>
        <HiUserAdd style={{color: 'whitesmoke', fontSize: '20px'}}/>Add Friends
      </div>
      
      {addFriends && 
      <div className='add-friend-form'>
        <form onSubmit={handleAddFriend}>
          {error && <p style={{fontSize: 'small', color: '#eddfc2'}}>{error}</p>}
          <div style={{margin: '4px'}}><label>Your Friend's Username: {' '}</label></div>
          <input type='text' onChange={e => setFriendsUn(e.target.value)} required></input>
          <button style={{margin: '5px'}} type='submit'>Add</button>
        </form>
      </div>}
      
      <div className='friends-list'>
        <h3>Friends: </h3>
        {friendData.length === 0 
          ? <p>You have no friends :(</p>
          : loading || friendData.map(renderFriend)}
      </div>
    </div>
  );
}

export default Friends;