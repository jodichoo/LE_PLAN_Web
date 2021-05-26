import React, { useEffect, useState } from 'react'; 
import { useAuth } from '../contexts/AuthContexts';
import { db } from '../firebase'; 


function TaskManager() {
    const currDate = new Date().toISOString().substring(0, 10);
    const [tasks, setTasks] = useState([]); 
    const { currentUser } = useAuth(); 
    const userTasks = db.collection('users').doc(currentUser.uid);
    
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

    return (
        <div>
        <table className='task-table'>
            <tbody>
                {tasks.map((task, index) => (
                <>
                <tr onMouseEnter={e => toggleTaskDesc(e, index, true)} onMouseLeave={e => toggleTaskDesc(e, index, false)} onClick={e => deleteTask(e, index)}>
                    <td><input type="checkbox" /></td>
                    <td>{task.time}{' '}{task.name}</td>
                    <td>{task.isWork ? 'WORK' : 'LIFE'}</td>
                </tr>
                <tr>
                    <td></td>
                    <td className='mouse-desc' id={index} style={{display: 'none'}}>{task.desc}</td>
                    <td></td>
                </tr>
                </>
                ))}
            </tbody>
        </table>
        </div>
    )
}

export default TaskManager; 