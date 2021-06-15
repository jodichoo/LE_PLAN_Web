import CenterDashboard from "./CenterDashboard";
import LeftDashboard from "./LeftDashboard";
import RightDashboard from "./RightDashboard";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { db } from "../firebase";
import ChromeDinoGame from "react-chrome-dino";
import moment from 'moment';

function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD")); 
  // const currDate = new Date().toLocaleDateString("en-CA");
  const [tasks, setTasks] = useState([]);
  const { currentUser } = useAuth();
  const userTasks = db.collection("users").doc(currentUser.uid);

  useEffect(() => {
    //get collection of tasks to be displayed
    const today = userTasks.collection(selectedDate);
    //order collection by time, then push each item in collection into array
    const unsubscribe = today.orderBy("time").onSnapshot((querySnapshot) => {
      const t = [];
      querySnapshot.forEach((doc) => {
        t.push(doc.data());
      });
      //set local tasks variable to array t
      setTasks(t);
    });
    return unsubscribe;
  }, [selectedDate]);

  return (
    <div classname="easter-egg">
      <div className="dash">
        {/* Left */}
        <LeftDashboard selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
        {/* Center */}
        <CenterDashboard selectedDate={selectedDate} tasks={tasks} setTasks={setTasks} />
        {/* Right */}
        <RightDashboard tasks={tasks} selectedDate={selectedDate}/>
      </div>
      <div className="stevie-boy">
        <ChromeDinoGame />
      </div>
    </div>
  );
}

export default Dashboard;
