import { useState, useEffect } from "react";
import '../styles/RightDashboard.css';
import TaskForm from "./TaskForm";
import Meter from "./Meter";
import moment from "moment";
import { BiCalendarPlus } from 'react-icons/bi'; 

function RightDashboard(props) {
  const [addWorkClicked, setAddWorkClicked] = useState(false);
  const [addLifeClicked, setAddLifeClicked] = useState(false);
  const { todayTasks, selectedDate } = props;
  const [taskLen, setTaskLen] = useState(todayTasks.length);
  const [time, setTime] = useState(moment().format("HH:mm"));
  const [upTaskIndex, setUpTaskIndex] = useState(0);

  useEffect(() => {
    var timer = setInterval(() => setTime(moment().format("HH:mm:ss")), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (todayTasks.length !== taskLen) {
      setUpTaskIndex(0);
      setTaskLen(todayTasks.length);
    }

      if (todayTasks.length > 0 && upTaskIndex >=0) {
        const arr = time.split(":");
        const currTime = parseFloat(arr[0]) + 0.01 * parseFloat(arr[1]);
        
        if (currTime > todayTasks[upTaskIndex].time) {
          console.log("sdfsdf");
          for (var i = upTaskIndex; i < todayTasks.length; i++) {
            console.log(todayTasks[i].time);
            setUpTaskIndex(i);
            if (todayTasks[i].time > currTime) {
              console.log("updating");
              break;
            }
          }
        }

        if (upTaskIndex >= todayTasks.length - 1 && currTime > todayTasks[upTaskIndex].time) {
          console.log("end");
          setUpTaskIndex(-1);
        }
      }
  }, [todayTasks, time]);

  function renderUpcoming() {
    if (upTaskIndex >= todayTasks.length) {
      setUpTaskIndex(todayTasks.length - 1); 
      return;
    }
    return todayTasks.length > 0 && upTaskIndex >= 0
      ? `Upcoming Task: ${todayTasks[upTaskIndex].name}`
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
      <div className="WL-meter">
        <div className='header'>Meter</div>
        <Meter />
      </div>

      <div className="upcoming-task">
        <h2>
          {renderUpcoming()}{" "}
        </h2>
      </div>

      <div className="add-task-bar">
        <div className='header'><BiCalendarPlus />{' '}Add Task</div>
        <div className='buttons'>
          <button id="work-button" onClick={showWorkTaskForm} disabled={addWorkClicked}>
            Work
          </button>
          {' '}
          <button id="life-button" onClick={showLifeTaskForm} disabled={addLifeClicked}>
            Play
          </button>
        </div>
        {addWorkClicked && (
          <TaskForm
            selectedDate={selectedDate}
            addWorkClicked={addWorkClicked}
            setAddWorkClicked={setAddWorkClicked}
            setAddLifeClicked={setAddLifeClicked}
          />
        )}
        {addLifeClicked && (
          <TaskForm
            selectedDate={selectedDate}
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
