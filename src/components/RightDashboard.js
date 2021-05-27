import { useState } from 'react'; 
import TaskForm from './TaskForm';


function RightDashboard() {
    const [addWorkClicked, setAddWorkClicked] = useState(false); 
    const [addLifeClicked, setAddLifeClicked] = useState(false); 

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
        <>
        {/* donut gauge */}
        {/* upcoming tasks */}
        <div id="add-task-bar">
                <label for="add-task"><h1 id="add-task">+ Add Task</h1></label>
                <button id="work-button" onClick={showWorkTaskForm}>Work</button>
                <button id="life-button" onClick={showLifeTaskForm}>Life</button>
                {addWorkClicked && <TaskForm addWorkClicked={addWorkClicked} setAddWorkClicked={setAddWorkClicked} 
                    setAddLifeClicked={setAddLifeClicked} />}
                {addLifeClicked && <TaskForm  addWorkClicked={addWorkClicked} setAddWorkClicked={setAddWorkClicked} 
                    setAddLifeClicked={setAddLifeClicked}/>}
                
        </div>
        </>
    )
}

export default RightDashboard; 