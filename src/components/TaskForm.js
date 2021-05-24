import { useState } from 'react'; 


function TaskForm(props) {
    // const [addWorkClicked, setAddWorkClicked] = useState(false); 
    // const [addLifeClicked, setAddLifeClicked] = useState(false); 
    const currDate = new Date().toISOString().substring(0, 10);
    const [taskName, setTaskName] = useState(''); 
    const [taskDesc, setTaskDesc] = useState(''); 
    const [taskDate, setTaskDate] = useState(currDate); 
    const [taskHrs, setTaskHrs] = useState(0); 
    const [taskMins, setTaskMins] = useState(0); 
    const [taskDur, setTaskDur] = useState(0); 
    const [isWork, setIsWork] = useState(true); 
    const [check, setCheck] = useState(true);
    const [tasks, setTasks] = useState([]); 
    const { addWorkClicked, setAddWorkClicked, setAddLifeClicked, addLifeClicked } = props;

    function removeTaskForm(e) {
        e.preventDefault(); 
        setAddWorkClicked(false); 
        setAddLifeClicked(false); 
    }

    function initStates() {
        setAddWorkClicked(false); 
        setAddLifeClicked(false); 
        setTaskName('');
        setTaskDesc(''); 
        setTaskHrs(0); 
        setTaskMins(0); 
        setTaskDur(0); 
        setTaskDate(currDate);
        setIsWork(true);  
    }

    function handleAddTask(e) {
        e.preventDefault();
        const t = parseInt(taskHrs) + parseFloat(taskMins/100); 
        console.log(t); 
        // update tasks here
        const newTask = {
                name: taskName,
                desc: taskDesc,
                time: t,
                dur: taskDur
        };
        //write to database here
        initStates();
    }

    function isChecked(e) {
        //e.preventDefault();
         setCheck(!check)
        // let checkBox = document.getElementById("want-reminder");
        let reminder = document.getElementById("rem-interval")
        if (check === true){
            console.log('dfsdf');
            reminder.style.display = "block";
            // checkBox.value = checked;
        } else {
            reminder.style.display = 'none';
        }
    }

    return (
        <div>
            <h2>{addWorkClicked ? 'work' : 'life' }</h2>
            <form onSubmit={e => {
                setIsWork(addWorkClicked); 
                handleAddTask(e, addWorkClicked); 
            }}>
                <div className="task-form">
                <label>Task Name: </label>
                <input type="text" onChange={e => setTaskName(e.target.value)} required></input>
                </div>
                
                <div className="task-form">
                <label>Task Description: </label>
                <input type="text" onChange={e => setTaskDesc(e.target.value)}></input>
                </div>
                
                <div className="task-form">
                <label>Date: </label>
                <input type="date" placeholder="yyyy-mm-dd" defaultValue={taskDate} min={currDate}
                onChange={e => setTaskDate(e.target.value)} requiredPattern="\d{4}-\d{2}-\d{2}" required></input>
                </div>
                
                <div className="task-form">
                <label>Time: {taskHrs} : {taskMins}</label>
                <input type="range" id="task-time-hour" defaultValue={taskHrs} max="23" min="0" onChange={e => setTaskHrs(e.target.value)} required></input>
                <input type="range" id="task-time-min" defaultValue={taskMins} max="59" min="0" onChange={e => setTaskMins(e.target.value)} required></input>
                </div>
                
                <div className="task-form">
                <label>Duration: </label>
                <input type="number" id="task-duration" step='0.25' min="0" placeholder='E.g. 2.25' required></input>
                </div>
                
                <div className="task-form">
                {/* <label for='want-reminder'> */}
                    <input type='checkbox' value='want-reminder' id='want-reminder' onChange= {isChecked}/> Set Reminders 
                {/* //</label>  */}
                </div>

                <div className="task-form" id="rem-interval" style={{display: 'none'}}>
                    <input type='checkbox' name='rem-freq' id='10-min'/> 10 min 
                    <input type='checkbox' name='rem-freq' id='30-min'/> 30 min 
                    <input type='checkbox' name='rem-freq' id='1-hour'/> 1 hour before
                    <input type='checkbox' name='rem-freq' id='3-hours'/> 3 hours before
                    <input type='checkbox' name='rem-freq' id='1-day'/> 1 day before
                    <input type='checkbox' name='rem-freq' id='3-days'/> 3 days before
                    <input type='checkbox' name='rem-freq' id='one-week'/> 1 week before
                    <input type='checkbox' name='rem-freq' id='one-week'/> 2 weeks before
                </div>

                <div className="task-form">
                <button  className="task-form" id="submit-task-button">Submit</button>
                <button  className="task-form" id="cancel-task-button" onClick={removeTaskForm}>Cancel</button> 
                </div>
            </form>
        </div>
    )
}

export default TaskForm; 