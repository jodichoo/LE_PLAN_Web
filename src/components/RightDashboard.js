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
        <div id="right-dash">
                {/* <label for="add-task"><h1 id="add-task">+ Add Task</h1></label> */}
                <div className="WL-meter">
                    <h1>METER</h1>
                    {/* <br /><br /><br /><br /> */}
                </div>

                <div className="add-task-abr">
                    <h1 id="add-task">+ Add Task</h1>
                    <button id="work-button" onClick={showWorkTaskForm}>Work</button>
                    <button id="life-button" onClick={showLifeTaskForm}>Life</button>

                    {addWorkClicked && <TaskForm addWorkClicked={addWorkClicked} setAddWorkClicked={setAddWorkClicked} 
                        setAddLifeClicked={setAddLifeClicked} />}
                    {addLifeClicked && <TaskForm  addWorkClicked={addWorkClicked} setAddWorkClicked={setAddWorkClicked} 
                        setAddLifeClicked={setAddLifeClicked}/>}
                </div>

                <div className="upcoming-task">
                    <h1>Upcoming task</h1>
                </div>
        </div>
    )
}

export default RightDashboard; 