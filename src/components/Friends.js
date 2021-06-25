import moment from "moment";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from '../contexts/AuthContexts'; 
import { HiUserAdd } from 'react-icons/hi';

function Friends(props) {
  const { currentUser } = useAuth(); 
  const [friendsUn, setFriendsUn] = useState(''); 
  const [error, setError] = useState('');
  const userTasks = db.collection('users').doc(currentUser.uid);  
  const [currUn, setCurrUn] = useState(''); 
  const [friendsList, setFriendsList] = useState([]);
  const [addFriends, setAddFriends] = useState(false);
  const [friendData, setFriendData] = useState([]); 

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
          setFriendData(dataList); 
        })
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
    }
  }

  function renderMeter(w, p) {
    const wFlex = p === 0 ? 100 : w * 100 / p + w; 
    const pFlex = w === 0 ? 100 : p * 100 / p + w;

    const styles = {
      wrapper: {
        display: 'flex', 
        flexDirection: 'row', 
        width: '100%',
        border: '1px solid whitesmoke'
      },
  
      work: {
        color: 'red',
        height: '100%', 
        flex: `${wFlex}%`,
        backgroundColor: 'red'
      },
      
      play: {
        color: 'green',
        height: '100%', 
        flex: `${pFlex}%`,
        backgroundColor: 'green'
      }
    };
  
    return (
      w === 0 && p === 0 
        ? <p>Noobie</p>
        : w === 0
          ? <div styles={styles.wrapper}>
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

  function renderFriend(friendObj) {
    return (
      <div className='friend'>
        <p>{friendObj.friend}{' '}{renderMeter(friendObj.work, friendObj.play)}</p>
        {/* {friendObj.work}/{friendObj.play} */}
        
      </div>
    )
  }

function showAddFriend(e) {
  e.preventDefault();
  setAddFriends(!addFriends);
}

  return (
    <div className="left-dash">
      {/* <button onClick={showAddFriend}>+ Add Friends</button> */}
      <div style ={{cursor: 'pointer'}} onClick={showAddFriend}>
        <HiUserAdd style={{color: 'whitesmoke', fontSize: '20px'}}/>Add Friends
      </div>
      
      {addFriends && <form onSubmit={handleAddFriend}>
        {error && <p>{error}</p>}
        <label>Your Friend's Username: {' '}</label>
        <input type='text' onChange={e => setFriendsUn(e.target.value)} required></input>
        <button type='submit'>Add</button>
      </form>}
      
      <div className='friends-list'>
        <h3>Friends: </h3>
        {friendData.length === 0 
          ? <p>You have no friends :(</p>
          : friendData.map(renderFriend)}
      </div>
    </div>
  );
}

export default Friends;