import CenterDashboard from "./CenterDashboard";
import LeftDashboard from "./LeftDashboard";
import RightDashboard from "./RightDashboard";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { db } from "../firebase";
import ChromeDinoGame from "react-chrome-dino";
import moment from 'moment';
import { useHistory } from "react-router-dom";


function Dashboard() {
  const currDate = moment().format('YYYY-MM-DD');
  const [selectedDate, setSelectedDate] = useState(currDate); 
  const [error, setError] = useState(""); 
  const history = useHistory();
  const [tasks, setTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]); 
  const { currentUser, logout } = useAuth();
  const userTasks = db.collection("users").doc(currentUser.uid);


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
  
  return (
    <div classname="dash">
      <div className="main-dash">
        <div className='navbar'>
          <div className='element'><button onClick={handleLogOut}>Log Out</button></div>
        </div>
        <div className='container'>
          {/* Left */}
          <LeftDashboard selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
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
