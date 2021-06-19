import React, { useState } from 'react'; 
import { useAuth } from '../contexts/AuthContexts';
import { db } from '../firebase'; 
import TaskForm from './TaskForm'; 
import moment from 'moment'; 
import { BiJoystick, BiPencil, BiTrash } from 'react-icons/bi'; 

function TaskManager(props) {
    const { tasks, selectedDate } = props; 
    // const [tasks, setTasks] = useState([]); 
    const { currentUser } = useAuth(); 
    const userTasks = db.collection('users').doc(currentUser.uid);
    const [editTask, setEditTask] = useState({});
    const [edit, setEdit] = useState(false); 

    function toggleTaskDesc(e, task, toggle) {
        e.preventDefault(); 
        let t = document.getElementById(task.id);
        if (toggle) {
            t.style.display = 'block';
        } else {
            t.style.display = 'none';
        } 
    }

    function deleteTask(e, task) {
        e.preventDefault(); 
        //delete task from database
        userTasks.collection(selectedDate).doc(task.id).delete();
        //update work/life time in database  
        const isWork = task.isWork; 
        const dur = task.dur; 

        const whatday = moment().day() === 0 ? 7 : moment().day();// 1,2,3,4....7
        const numDays = whatday - 1; // num of times to mathfloor
        const monDate = moment().subtract(numDays, 'days');

        if (moment(task.date, "YYYY-MM-DD").diff(monDate, 'days') < 6) {
            userTasks.get().then(doc => {
                if (isWork) {
                    const currWork = doc.data().workTime; 
                    userTasks.update({
                      workTime: currWork - dur  
                    })
                } else {
                    const currLife = doc.data().lifeTime; 
                    userTasks.update({
                        lifeTime: currLife - dur  
                    })
                }
            })
        }
    }

    function handleEditTask(e, task) {
        e.preventDefault(); 
        //setEdit(false);
        setEdit(true); 
        setEditTask(task);
        console.log("call edit") 
    }

    // function changeForm(e) {
    //     e.preventDefault();
    //     setEdit(false);
    //     console.log("change form")
    // }

    function convertTime(num) {
        const s = parseFloat(num).toFixed(2).toString(); 
        const split = s.split('.');
        if (split[0] < 10) {
            return "0" + split[0] + ":" + split[1];
        } else {
            return split[0] + ':' + split[1]; 
        } 
    }

    function handleCheck(e, task) {
        e.preventDefault(); 
        //toggle isComplete for the selected task 
        userTasks.collection(selectedDate).doc(task.id).update({
            isComplete: !task.isComplete
        });
    }

    function separateTasks(arr) {
        const len = arr.length; 
        const completed = []; 
        const incomplete = [];
        //go through array of tasks
        for (var i = 0; i < len; i++) {
            if (arr[i].isComplete) { //if task is complete, push into complete array
                completed.push(arr[i]); 
            } else { //else, push into incomplete array
                incomplete.push(arr[i]); 
            }
        }
        return [incomplete, completed]; //return separated tasks
    }

    function renderTask(task, indicator) {
        var style = indicator === 0 
            ? { color: 'black', backgroundColor: 'whitesmoke' }
            : { color: 'whitesmoke', backgroundColor: '#8a5858'}

        const iconsStyle = indicator === 0 
            ? { color: 'black', fontSize: '20px' }
            : { color: 'whitesmoke' , fontSize: '20px'}
        
        return (
            <>
                <div className='task' style={style} onMouseEnter={e => toggleTaskDesc(e, task, true)} 
                    onMouseLeave={e => toggleTaskDesc(e, task, false)}>
                    <div className='check'><input type="checkbox" id="completed-check" checked={task.isComplete} 
                        onChange={e => handleCheck(e, task)}/>
                    </div>
                    <div className='time'>{convertTime(task.time)}</div>
                    <div className='name' onClick={e => {handleEditTask(e, task);}}>{task.name}</div>
                    <div className='type'>{task.isWork ? <BiPencil style={iconsStyle}/> : <BiJoystick style={iconsStyle}/>}</div>
                    {/* <div className='delete'><button id="delete-task" onClick={e => deleteTask(e, task)}>Delete</button></div> */}
                    <div className='delete'><BiTrash style={{...iconsStyle, cursor:'pointer'}} onClick={e => deleteTask(e, task)} /></div>

                </div>
                <div className='mouse-desc' id={task.id} style={{display: 'none'}}>{task.desc}</div>
            </>
        )
    }

    return (
        <div className='task-manager'>

            {/* incomplete tasks  */}
            {(separateTasks(tasks)[0].map(task => renderTask(task, 0)))}
            {/* complete tasks */}
            {(separateTasks(tasks)[1].map(task => renderTask(task, 1)))}

            {edit && <div className='edit'>
                <div className='edit-form'>
                    <TaskForm editTask={editTask} edit={edit} setEdit={setEdit} />
                </div>
            </div>}
        </div>
    )
}

export default TaskManager; 