import React, { useState } from 'react'; 


function TaskManager() {
    const tasks = [{
        isWork: true, 
        name: 'lmaolmaolmao',
        desc: 'lololoolol',
        time: 12.30,
        dur: 2
    },{
        isWork: false, 
        name: 'sfsdfsdfsdf',
        desc: 'sdfd',
        time: 16.40,
        dur: 3
    }]; 

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
        //update current task variable 
    }

    return (
        <div>
            {/* some header using username */}
            <h1>header</h1>
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