import React, { useEffect, useState } from 'react'; 
import { useAuth } from '../contexts/AuthContexts';
import { db } from '../firebase'; 
import TaskForm from './TaskForm'; 


function TaskManager() {
    const currDate = new Date().toISOString().substring(0, 10);
    const [tasks, setTasks] = useState([]); 
    const { currentUser } = useAuth(); 
    const userTasks = db.collection('users').doc(currentUser.uid);
    const [editTask, setEditTask] = useState({});
    const [edit, setEdit] = useState(false); 
    
    useEffect(() => {
        //get collection of tasks to be displayed 
        const today = userTasks.collection(currDate); 
        //order collection by time, then push each item in collection into array 
        const unsubscribe = today.orderBy('time').onSnapshot((querySnapshot) => {
            const t = []; 
            querySnapshot.forEach(doc => {
                t.push(doc.data());
            })
            //set local tasks variable to array t 
            setTasks(t); 
        })
        return unsubscribe;
    }, [])

    function toggleTaskDesc(e, index, toggle) {
        e.preventDefault(); 
        // console.log(tasks[index].desc);
        let t = document.getElementById(index);
        if (toggle) {
            t.style.display = 'block';
        } else {
            t.style.display = 'none';
        } 
    }

    function deleteTask(e, index) {
        e.preventDefault(); 
        //delete task from database
        userTasks.collection(currDate).doc(tasks[index].id).delete(); 
        //update local task variable 
        const first = tasks.slice(0, index); 
        const last = tasks.slice(index + 1, tasks.length); 
        const newTasks = [...first, ...last]; 
    }
    function handleEditTask(e, index) {
        e.preventDefault(); 
        setEdit(true); 
        setEditTask(tasks[index]); 
    }

    function convertTime(num) {
        const s = num.toString(); 
        const split = s.split('.'); 
        return split[0] + ':' + split[1]; 
    }

    return (
        <div>
        <table className='task-table'>
            <tbody>
                {tasks.map((task, index) => (
                <>
                <tr onMouseEnter={e => toggleTaskDesc(e, index, true)} onMouseLeave={e => toggleTaskDesc(e, index, false)}>
                    <td><input type="checkbox" id="completed-check"/></td>
                    <td>{convertTime(task.time)}</td>
                    <td onClick={e => handleEditTask(e, index)}>{task.name}</td>
                    <td>{task.isWork ? 'WORK' : 'LIFE'}</td>
                    <td><button id="delete-task" onClick={e => deleteTask(e, index)}>Delete</button></td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td className='mouse-desc' id={index} style={{display: 'none'}}>{task.desc}</td>
                    <td></td>
                    <td></td>
                </tr>
                </>
                ))}
            </tbody>
        </table>
        {edit && <TaskForm editTask={editTask} edit={edit} setEdit={setEdit} />}
        
        </div>
    )
}

export default TaskManager; 