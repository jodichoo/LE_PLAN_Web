import { useState, useEffect } from 'react'; 
import { useAuth } from '../contexts/AuthContexts';
import { db } from '../firebase'; 
import moment from 'moment'; 
import TimePicker from 'react-time-picker';

function TaskForm(props) {
    const { addWorkClicked, setAddWorkClicked, setAddLifeClicked, editTask, edit, setEdit, selectedDate } = props; 
    const currDate = new Date().toLocaleDateString('en-CA');
    const [taskName, setTaskName] = useState(''); 
    const [taskDesc, setTaskDesc] = useState(''); 
    const [taskDate, setTaskDate] = useState(selectedDate); 
    // const [taskHrs, setTaskHrs] = useState(0); 
    // const [taskMins, setTaskMins] = useState(0); 
    const [taskDur, setTaskDur] = useState(''); 
    const [check, setCheck] = useState(true);
    const [isWork, setIsWork] = useState(true); 
    const { currentUser } = useAuth(); 
    const userTasks = db.collection('users').doc(currentUser.uid); 
    const [taskTime, setTaskTime] = useState(moment().format('HH:mm')); 

    useEffect(() => {
        if (edit) {
            setTaskName(editTask.name); 
            setTaskDesc(editTask.desc); 
            setTaskDate(editTask.date); 
            // setTaskHrs(getHour(editTask.time)); 
            // setTaskMins(getMin(editTask.time)); 
            setTaskTime(getTimeInStr(editTask.time));
            setTaskDur(editTask.dur); 
            setIsWork(editTask.isWork)

            if (editTask.isWork) {
                document.getElementById('work-radio-edit').checked = true;
            } else {
                document.getElementById('life-radio-edit').checked = true;
            }
        }
    }, []); 

    function getTimeInStr(num) {
        if (num === 0) {
            return '00:00'; 
        } else {
            const str = num.toFixed(2); 
            const spl = str.split('.');   
            return `${spl[0]}:${spl[1]}`; 
        }
    }

    // function getHour(num) {
    //     if (num === 0) {
    //         return num; 
    //     } else {
    //         const str = num.toString();
    //         const split = str.split('.');
    //         return parseInt(split[0]);
    //     }
    // }

    // function getMin(num) {
    //     if (num === 0) {
    //         return num; 
    //     } else {
    //         const str = num.toFixed(2);
    //         const split = str.split('.');
    //         return parseInt(split[1]);
    //     }
    // }

    function removeTaskForm(e) {
        e.preventDefault(); 
        if (edit) {
            setEdit(false); 
        } else {
            setAddWorkClicked(false); 
            setAddLifeClicked(false); 
        }
    }

    function initStates() {
        if (edit) {
            setEdit(false); 
        } else {
            setAddWorkClicked(false); 
            setAddLifeClicked(false); 
        }
        setTaskName('');
        setTaskDesc(''); 
        // setTaskHrs(0); 
        // setTaskMins(0); 
        setTaskTime(moment().format('HH:mm')); 
        setTaskDur(''); 
        setTaskDate(selectedDate);
        setIsWork(true);  
    }

    function handleAddTask(e) {
        e.preventDefault();
        //convert taskTime from string to float 
        const spl = taskTime.split(':'); 
        const t = parseInt(spl[0]) + parseFloat(spl[1] / 100); 
        // const t = parseInt(taskHrs) + parseFloat(taskMins/100); 
        //create a new doc within the relevant collection 
        const ref = userTasks.collection(taskDate).doc();
        const work = edit ? isWork : addWorkClicked;
        // update tasks here
        const newTask = {
                id: ref.id, //id field necessary to delete task later 
                date: taskDate, 
                isWork: work, 
                name: taskName,
                desc: taskDesc,
                time: t,
                dur: parseFloat(taskDur), 
                isComplete: false 
        };
        //write to database here
        console.log(work); 
        //add the new task to the database
        ref.set(newTask);

        //update work/lifeTime for the meter
        const whatday = moment().day() === 0 ? 7 : moment().day();// 1,2,3,4....7
        const numDays = whatday - 1; // num of times to mathfloor
        const monDate = moment().subtract(numDays, 'days');
        if (moment(taskDate, "YYYY-MM-DD").diff(monDate, 'days') < 6) {
            //change below 
            handleCounters(work, "+", taskDur);
        }
        initStates();
    }

    function handleEditTask(e) {
        e.preventDefault(); 
        const whatday = moment().day() === 0 ? 7 : moment().day();// 1,2,3,4....7
        const numDays = whatday - 1; // num of times to mathfloor
        const monDate = moment().subtract(numDays, 'days');
        userTasks.collection(editTask.date).doc(editTask.id).delete().then(() => {
            if (moment(editTask.date, "YYYY-MM-DD").diff(monDate, 'days') < 6) {
                //if editing, delete the previous task + subtract from work/lifeTime for meter
                console.log('subtract');
                handleCounters(editTask.isWork, "-", editTask.dur);
            }
        })
    }

    function handleCounters(work, operator, dur) {
            userTasks.get().then(doc => {
                if (work) {
                    const currWork = doc.data().workTime;
                    userTasks.update({
                        workTime: eval(currWork.toString() + operator + parseFloat(dur).toString())
                    });
                } else {
                    const currLife = doc.data().lifeTime; 
                    userTasks.update({
                        lifeTime: eval(currLife.toString() + operator + parseFloat(dur).toString())
                    });
                }
            })
    }

    function isChecked(e) {
        e.preventDefault();
         setCheck(!check)
        let reminder = document.getElementById("rem-interval")
        if (check === true){
            reminder.style.display = "block";
        } else {
            reminder.style.display = 'none';
        }
    }

    return (
        <div className='task-form'>
            {/* <p>{!edit && (addWorkClicked ? 'Work' : 'Play')}</p> */}
            <div className='task-form-container'>
            <form onSubmit={e => {
                edit && handleEditTask(e);
                handleAddTask(e); 
            }}>
                {edit && <div className='task-form-field'>
                    <input type='radio' name='work-life-button' id='work-radio-edit' onChange={e => setIsWork(true)} /> Work
                    <input type='radio' name='work-life-button' id='life-radio-edit' onChange={e => setIsWork(false)} /> Play
                </div> }

                <div className="task-form-field">
                <div className='form-label'><label>Task Name: </label></div>
                <div className='form-input'>
                    <input id='test' type="text" defaultValue={taskName} onChange={e => setTaskName(e.target.value)} required></input>
                </div>
                </div>
                
                <div className="task-form-field">
                <div className='form-label'><label>Description: </label></div>
                <div className='form-input'>
                    <input type="text" defaultValue={taskDesc} onChange={e => setTaskDesc(e.target.value)}></input>
                </div>
                </div>
                
                <div className="task-form-field">
                <div className='form-label'><label>Date: </label></div>
                <div className='form-input'>
                    <input type="date" placeholder="yyyy-mm-dd" defaultValue={taskDate} min={currDate}
                        onChange={e => setTaskDate(e.target.value)} requiredPattern="\d{4}-\d{2}-\d{2}" required></input>
                </div>
                </div>
                
                {/* <div className="task-form-field">
                <label>Time: {taskHrs} : {taskMins}{' '}</label>
                <input type="range" id="task-time-hour" defaultValue={taskHrs} max="23" min="0" onChange={e => setTaskHrs(e.target.value)} required></input>
                <input type="range" id="task-time-min"  defaultValue={taskMins} max="59" min="0" onChange={e => setTaskMins(e.target.value)} required></input>
                </div> */}
                
                <div className="task-form-field">
                <div className='form-label'><label>Time: </label></div>
                {/* <div className='form-input'> */}
                    <TimePicker value={taskTime} onChange={setTaskTime} disableClock={true}/>
                {/* </div> */}
                </div>

                <div className="task-form-field">
                <div className='form-label'><label>Duration: </label></div>
                <div className='form-input'>
                    <input style={{width: "70px"}} type="number" id="task-duration" defaultValue={taskDur} step='0.25' min="0.25" placeholder='E.g. 2.25' onChange={e => setTaskDur(e.target.value)} required>
                        </input>{" "}h
                </div>
                </div>
                
                <div className="task-form-field">
                    <div className='form-label'><label>Set Reminders</label></div>
                    <div className='form-input'><input type='checkbox' value='want-reminder' id='want-reminder' onChange={isChecked}/></div>
                </div>

                <div className="task-form-field" id="rem-interval" style={{display: 'none'}}>
                    <input type='checkbox' name='rem-freq' id='10-min'/> 10 min 
                    <input type='checkbox' name='rem-freq' id='30-min'/> 30 min 
                    <input type='checkbox' name='rem-freq' id='1-hour'/> 1 hour before
                    <input type='checkbox' name='rem-freq' id='3-hours'/> 3 hours before
                    <input type='checkbox' name='rem-freq' id='1-day'/> 1 day before
                    <input type='checkbox' name='rem-freq' id='3-days'/> 3 days before
                    <input type='checkbox' name='rem-freq' id='one-week'/> 1 week before
                    <input type='checkbox' name='rem-freq' id='one-week'/> 2 weeks before
                </div>

                <div className="task-form-field" id='submit-cancel'>
                    <button>Submit</button>
                    <button onClick={removeTaskForm}>Cancel</button>
                </div>
            </form>
            </div>
        </div>
    )
}

export default TaskForm; 