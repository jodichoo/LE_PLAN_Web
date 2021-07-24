import TaskManager from "./TaskManager";
import '../styles/CenterDashboard.css';
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { db } from "../firebase";
import moment from "moment";

function CenterDashboard(props) {
  const { tasks, setTasks, selectedDate } = props; 
  const { currentUser } = useAuth();
  const userTasks = db.collection("users").doc(currentUser.uid);
  const [date, setDate] = useState(new Date());
  var storedDate;
  const currDate = moment();

  async function handleGetMeterData(monDate) {
    var workCount = 0;
    var lifeCount = 0;

    for (var i = 0; i <= 6; i++) {
      const tempDate = moment(monDate);
      tempDate.add(i, "days"); //set date to next day of the week
      const str = tempDate.format("YYYY-MM-DD"); //to find tasks in database
      await userTasks
        .collection(str)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.exists) {
              const isWork = doc.data().isWork;
              const dur = doc.data().dur;
              if (isWork) {
                workCount += dur;
              } else {
                lifeCount += dur;
              }
            }
          });
        });
      userTasks.update({
        workTime: workCount,
        lifeTime: lifeCount,
      });
    }
  }


  async function updateStonks(monDate) {
    const data = []; 
    for (var i = 4; i > 0; i--) {
      // const start = moment(monDate, 'YYYY-MM-DD').subtract(i, 'week'); //i th mondate
      // console.log('enter outer loop', i, start.format('YYYY-MM-DD')); 
      var workCount = 0;
      var lifeCount = 0;

      for (var j = 0; j <= 6; j++) {
        console.log('enter inner loop'); 
        const tempDate = moment(monDate, 'YYYY-MM-DD').subtract(i, 'week');
        tempDate.add(j, "days"); //set date to next day of the week
        const str = tempDate.format("YYYY-MM-DD"); //to find tasks in database
        await userTasks
          .collection(str)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              if (doc.exists) {
                const isWork = doc.data().isWork;
                const dur = doc.data().dur;
                if (isWork) {
                  workCount += dur;
                } else {
                  lifeCount += dur;
                }
              }
            });
          });
          console.log(tempDate.format('YYYY-MM-DD'), workCount, lifeCount); 
      }

      const dataItem = workCount === 0 && lifeCount === 0 
        ? -1
        : 100 * parseFloat(workCount)/ (parseFloat(workCount) + parseFloat(lifeCount))
      console.log('dataItem', dataItem);
      // data.push(dataItem);
      data.push(Math.round(dataItem * 100) / 100);
    }
    //update database 
    userTasks.update({
      stonksData: data
    }).then(() => {
      console.log('updated data'); 
    });
  }

  function updateMeterData() {
      //check if current date is >6 days after the last stored monday date
      if (moment().diff(moment(storedDate, "YYYY-MM-DD"), "days") > 6) {
        //if so, find the monday date of the current week
        console.log("went here");
        const whatday = currDate.day() === 0 ? 7 : currDate.day(); // 1,2,3,4....7
        const numDays = whatday - 1; // num of times to mathfloor
        const monDate = moment().subtract(numDays, "days").format("YYYY-MM-DD"); //monday of the current week
        
        updateStonks(monDate);
        
        userTasks
          .update({
            //update storedDate in database to limit reinitialisation
            storedDate: monDate,
          })
          .then(() => {
            return handleGetMeterData(monDate);
          });
      }
  }

  useEffect(() => {
    userTasks.get()
      .then((doc) => {
        if (doc.exists) {
          //account details exist
          storedDate = doc.data().storedDate;
        } 
      })
        .then(() => {
          console.log(`stored date is ${storedDate}`);
          updateMeterData(); 
        })

    var timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  }, []);

  function convertGreet(num) {
    const time = parseInt(num.toLocaleTimeString("en-GB").split(":")[0]);
    // console.log(time);
    if (time < 12) {
      return "Good Morning";
    } else if (time < 17) {
      return "Good Afternoon";
    } else if (time < 24) {
      return "Good Evening";
    } else {
      return "HAHAHAHAHAAH";
    }
  }

  function addressDate(d) {
    if (d === currDate.format('YYYY-MM-DD')) {
      return 'today'; 
    } else if (d === currDate.add(1, 'day').format('YYYY-MM-DD')) {
      return 'tomorrow'; 
    } else {
      return d; 
    }
  }

  return (
    <div className="center-dash">
      {/* <div className='container'> */}
        <div className='heading'>
          <div className='greeting'>
          {convertGreet(date)}, <span style={{color: '#eddfc2'}}>{currentUser.displayName}!</span><br></br> 
          </div>
          <div className='time-greeting'>
            The time is {date.toLocaleTimeString()}<br></br>
          </div>
          <div className='here-tasks'>
            Here are your tasks for {addressDate(selectedDate)}:
          </div>          
        </div>

        <TaskManager selectedDate={selectedDate} tasks={tasks} setTasks={setTasks}/>

      {/* </div> */}
      
    </div>
  );
}

export default CenterDashboard;
