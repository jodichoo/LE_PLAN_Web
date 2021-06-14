import { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import Meter from "./Meter";
import moment from "moment";

function RightDashboard(props) {
  const [addWorkClicked, setAddWorkClicked] = useState(false);
  const [addLifeClicked, setAddLifeClicked] = useState(false);
  const { tasks } = props;
  const [taskLen, setTaskLen] = useState(tasks.length);
  const [time, setTime] = useState(moment().format("HH:mm"));
  const [upTaskIndex, setUpTaskIndex] = useState(0);

  useEffect(() => {
    var timer = setInterval(() => setTime(moment().format("HH:mm:ss")), 1000);
    // var timer = setInterval(() => setTime(nextTask()), 60000);
    return function cleanup() {
      clearInterval(timer);
    };
  }, []);

//   function nextTask() {
//       setTime(moment().format("HH:mm"));
//     if (tasks.length > 0) {
//         console.log("enter hook")
//       const arr = time.split(":");
//       const currTime = parseFloat(arr[0]) + 0.01 * parseFloat(arr[1]);
//       if (upTaskIndex === tasks.length - 1 && currTime > tasks[upTaskIndex].time) {
//         console.log("end");
//         setUpTaskIndex(-1);
//       }

//       if (currTime > tasks[upTaskIndex].time && upTaskIndex >= 0) {
//         console.log("sdfsdf");
//         for (var i = upTaskIndex; i < tasks.length; i++) {
//           console.log(tasks[i].time);
//           setUpTaskIndex(i);
//           if (tasks[i].time > currTime) {
//             console.log("updating");
//             setUpTaskIndex(i);
//             break;
//           }
//         }
//       }
//     }
//   }
  useEffect(() => {
    if (tasks.length !== taskLen) {
        setUpTaskIndex(0);
        setTaskLen(tasks.length);
    }
    
    if (tasks.length > 0 && upTaskIndex >=0) {
        console.log("enter hook", upTaskIndex)
      const arr = time.split(":");
      const currTime = parseFloat(arr[0]) + 0.01 * parseFloat(arr[1]);
      
      if (currTime > tasks[upTaskIndex].time) {
          console.log(upTaskIndex); //1
        console.log("sdfsdf");
        for (var i = upTaskIndex; i < tasks.length; i++) {
          console.log(tasks[i].time);
          setUpTaskIndex(i);
          if (tasks[i].time > currTime) {
            console.log("updating");
            // setUpTaskIndex(i);
            break;
          }
        }
      }

      if (upTaskIndex >= tasks.length - 1 && currTime > tasks[upTaskIndex].time) {
        console.log("end");
        setUpTaskIndex(-1);
      }
    }
  }, [tasks, time]);

  function renderUpcoming() {
    if (upTaskIndex >= tasks.length) {
      setUpTaskIndex(tasks.length - 1); 
      return;
    }
    return tasks.length > 0 && upTaskIndex >= 0
      ? `Upcoming Task: ${tasks[upTaskIndex].name}`
      : "No Upcoming Tasks"
  }

  function showWorkTaskForm(e) {
    e.preventDefault();
    if (addLifeClicked) {
      setAddLifeClicked(false);
    }
    setAddWorkClicked(true);
  }

  function showLifeTaskForm(e) {
    e.preventDefault();
    if (addWorkClicked) {
      setAddWorkClicked(false);
    }
    setAddLifeClicked(true);
  }

  return (
    <div className="right-dash">
      {/* <label for="add-task"><h1 id="add-task">+ Add Task</h1></label> */}
      <div className="WL-meter">
        <Meter />
        {/* <br /><br /><br /><br /> */}
      </div>

      <div className="upcoming-task">
        <h2>
          {renderUpcoming()}{" "}
        </h2>
      </div>

      <div className="add-task-bar">
        <div className='fields'>
        <h1 id="add-task">+ Add Task</h1>
        <button id="work-button" onClick={showWorkTaskForm}>
          Work
        </button>
        <button id="life-button" onClick={showLifeTaskForm}>
          Life
        </button>
        </div>
        {addWorkClicked && (
          <TaskForm
            addWorkClicked={addWorkClicked}
            setAddWorkClicked={setAddWorkClicked}
            setAddLifeClicked={setAddLifeClicked}
          />
        )}
        {addLifeClicked && (
          <TaskForm
            addWorkClicked={addWorkClicked}
            setAddWorkClicked={setAddWorkClicked}
            setAddLifeClicked={setAddLifeClicked}
          />
        )}
      </div>
    </div>
  );
}

export default RightDashboard;
