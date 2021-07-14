import CenterDashboard from "./CenterDashboard";
import RightDashboard from "./RightDashboard";
import '../styles/Dashboard.css';
import Calendar from "./Calendar";
import Friends from "./Friends";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { db } from "../firebase";
import ChromeDinoGame from "react-chrome-dino";
import moment from 'moment';
import { Link, useHistory } from "react-router-dom";
import { BiCalendar } from 'react-icons/bi'; 
import { FaUserFriends } from 'react-icons/fa'
import { ImExit } from 'react-icons/im'; 
import { CgProfile } from 'react-icons/cg';
import { IoSettingsSharp } from 'react-icons/io5'; 



function Dashboard() {
  const currDate = moment().format('YYYY-MM-DD');
  const [selectedDate, setSelectedDate] = useState(currDate); 
  const [error, setError] = useState(""); 
  const history = useHistory();
  const [tasks, setTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]); 
  const { currentUser, logout } = useAuth();
  const userTasks = db.collection("users").doc(currentUser.uid);
  const [showCal, setShowCal] = useState(false); 
  const [showFriends, setShowFriends] = useState(false); 


  //get current date's tasks for right dashboard
  useEffect(() => {
    //get collection of current date's tasks
    const today = userTasks.collection(currDate); 
    const unsubscribe = today.orderBy("time").onSnapshot((querySnapshot) => {
      const t = [];
      querySnapshot.forEach((doc) => {
        t.push(doc.data());
      });
      //set local tasks variable to array t
      setTodayTasks(t);
    });
    return () => unsubscribe();
  }, [])


  //gets and displays tasks based on date selected from left dashboard 
  useEffect(() => {
    //get collection of tasks to be displayed
    const selected = userTasks.collection(selectedDate);
    //order collection by time, then push each item in collection into array
    const unsubscribe = selected.orderBy("time").onSnapshot((querySnapshot) => {
      const t = [];
      querySnapshot.forEach((doc) => {
        t.push(doc.data());
      });
      //set local tasks variable to array t
      setTasks(t);
    });
    return () => unsubscribe();
  }, [selectedDate]);

  async function handleLogOut() {
    setError("");
    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Failed to log out");
    }
  }
  
  function toggleCalendar(e) {
    e.preventDefault();  
    setShowFriends(false);
    setShowCal(!showCal);
  }

  function toggleFriends(e) {
    e.preventDefault(); 
    setShowCal(false); 
    setShowFriends(!showFriends);
  }

  const iconStyle = {
    // color: '#eddfc2', 
    color: 'white',
    fontSize: '30px', 
    cursor: 'pointer'
  }; 

  return (
    <div className="dash">
      <div className="main-dash">
        <div className='navbar'>
          <div className='left'>
            <div className='element'>
              <BiCalendar style={iconStyle} onClick={e => toggleCalendar(e)}/>
            </div>
            <div className='element'>
              <FaUserFriends style={iconStyle} onClick={e => {toggleFriends(e)}}/>
            </div>
            <div className='element'>
              <Link to='/profile'><CgProfile style={iconStyle} /></Link>
            </div>
          </div>
          <div className='right'>
          <div className='element'>
              <Link to='/settings'><IoSettingsSharp style={iconStyle}/></Link>
            </div>
            <div className='element'>
              <ImExit style={iconStyle} onClick={e => handleLogOut()}/>
            </div>
          </div>
        </div>
        <div className='container'>
          {/* Left */}
          {showCal && <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>}
          {showFriends && <Friends />}
          {/* <LeftDashboard selectedDate={selectedDate} setSelectedDate={setSelectedDate}/> */}
          {/* Center */}
          <CenterDashboard selectedDate={selectedDate} tasks={tasks} setTasks={setTasks} />
          {/* Right */}
          <RightDashboard todayTasks={todayTasks} selectedDate={selectedDate}/>
        </div>
      </div>
      <div className="stevie-boy">
        <ChromeDinoGame />
      </div>
    </div>
  );
}

export default Dashboard;
