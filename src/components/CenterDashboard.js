import TaskManager from "./TaskManager";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { db } from "../firebase";
import moment from "moment";

function CenterDashboard(props) {
  const { tasks, setTasks, selectedDate } = props; 
  const { currentUser, username } = useAuth();
  const userTasks = db.collection("users").doc(currentUser.uid);
  const [greetName, setGreetName] = useState("empty");
  const [date, setDate] = useState(new Date());
  var storedDate;
  const currDate = moment();

  async function handleGetMeterData(monDate) {
    var workCount = 0;
    var lifeCount = 0;

    for (var i = 0; i <= 6; i++) {
      console.log("getting the durations");
      const tempDate = moment(monDate);
      tempDate.add(i, "days"); //set date to next day of the week
      const str = tempDate.format("YYYY-MM-DD"); //to find tasks in database
      console.log(i, str);
      await userTasks
        .collection(str)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.exists) {
              const isWork = doc.data().isWork;
              const dur = doc.data().dur;
              console.log(doc.data().date, isWork, doc.data().name);
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

  function updateMeterData() {
      //check if current date is >6 days after the last stored monday date
      if (moment().diff(moment(storedDate, "YYYY-MM-DD"), "days") > 6) {
        //if so, find the monday date of the current week
        console.log("went here");
        const whatday = currDate.day() === 0 ? 7 : currDate.day(); // 1,2,3,4....7
        const numDays = whatday - 1; // num of times to mathfloor
        const monDate = moment().subtract(numDays, "days").format("YYYY-MM-DD"); //monday of the current week

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
          setGreetName(doc.data().username);
          storedDate = doc.data().storedDate;
        } 
        // else {
        //   //account details do not exist, so initialise account details
        //   console.log("dont exist");
        //   userTasks.set({
        //     username: username,
        //     storedDate: '2021-05-31',
        //     workTime: 0, //for work-life meter
        //     lifeTime: 0, //for work-life meter
        //   })
        //     .then(() => {
        //       storedDate = '2021-05-31'; 
        //       setGreetName(username);
        //       console.log('setting storedDate'); 
        //     });
        // }
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

  //get the username for custom greeting
  useEffect(() => {
    userTasks.get().then((doc) => {
      if (doc.exists) {
        //account details exist
        const unsubscribe = setGreetName(doc.data().username);
        return unsubscribe;
      } else {
        //account details do not exist, so initialise account details
        const unsubscribe = userTasks.set({
          username: username,
          workTime: 0, //for work-life meter
          lifeTime: 0, //for work-life meter
        });
        setGreetName(username);
        return unsubscribe;
      }
    });
  }, []);

  return (
    <div className="center-dash">

      <div className='container'>
        <div className='heading'>
          <h1>
            {date.toLocaleTimeString()} {convertGreet(date)}, {greetName}!
          </h1>
          <h2>
            {/* Here are your tasks for {date.toLocaleDateString()} ecksdee ecksdee */}
            Here are your tasks for {selectedDate} ecksdee ecksdee
          </h2>
        </div>

        <TaskManager selectedDate={selectedDate} tasks={tasks} setTasks={setTasks}/>

      </div>
      
    </div>
  );
}

export default CenterDashboard;
