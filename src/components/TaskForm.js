import { useState, useEffect } from 'react'; 
import { useAuth } from '../contexts/AuthContexts';
import { db } from '../firebase'; 
import moment from 'moment'; 
import TimePicker from 'react-time-picker';
import { GoX } from 'react-icons/go'; 

function TaskForm(props) {
    const { addWorkClicked, setAddWorkClicked, setAddLifeClicked, editTask, edit, setEdit, selectedDate } = props; 
    const currDate = new Date().toLocaleDateString('en-CA');
    const [taskName, setTaskName] = useState(''); 
    const [taskDesc, setTaskDesc] = useState(''); 
    const [taskDate, setTaskDate] = useState(selectedDate); 
    const [taskDur, setTaskDur] = useState(''); 
    const [isWork, setIsWork] = useState(true); 
    const { currentUser } = useAuth(); 
    const userTasks = db.collection('users').doc(currentUser.uid); 
    const [taskTime, setTaskTime] = useState(moment().format('HH:mm')); 
    const [error, setError] = useState(''); 

    useEffect(() => {
        if (edit) {
            setTaskName(editTask.name); 
            setTaskDesc(editTask.desc); 
            setTaskDate(editTask.date); 
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
        setTaskTime(moment().format('HH:mm')); 
        setTaskDur(''); 
        setTaskDate(selectedDate);
        setIsWork(true);  
    }

    function handleAddTask(e) {
        e.preventDefault();
        const trimName = taskName.trim(); 
        const trimDesc = taskDesc.trim(); 
        if (trimName.length === 0) {
            console.log('invalid'); 
            return setError('Please enter a valid task name'); 
        }
        //convert taskTime from string to float 
        const spl = taskTime.split(':'); 
        const t = parseInt(spl[0]) + parseFloat(spl[1] / 100); 
        const ref = userTasks.collection(taskDate).doc();
        const work = edit ? isWork : addWorkClicked;
        // update tasks here
        const newTask = {
                id: ref.id, //id field necessary to delete task later 
                date: taskDate, 
                isWork: work, 
                name: trimName,
                desc: trimDesc,
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

    return (
        <div className='task-form'>
            {error && <div className='form-error'><GoX style={{color: 'red', fontSize: '20px'}} />{error}</div>}
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
                
                <div className="task-form-field">
                <div className='form-label'><label>Time: </label></div>
                    <TimePicker value={taskTime} onChange={setTaskTime} disableClock={true}/>
                </div>

                <div className="task-form-field">
                <div className='form-label'><label>Duration: </label></div>
                <div className='form-input'>
                    <input style={{width: "70px"}} type="number" id="task-duration" defaultValue={taskDur} step='0.25' min="0.25" placeholder='E.g. 2.25' onChange={e => setTaskDur(e.target.value)} required>
                        </input>{" "}h
                </div>
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