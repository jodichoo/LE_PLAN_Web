import { useState } from 'react'; 

function RightDashboard() {
    const [addWorkClicked, setAddWorkClicked] = useState(false); 
    const [addLifeClicked, setAddLifeClicked] = useState(false); 
    const currDate = new Date().toISOString().substring(0, 10);
    const [taskDate, setTaskDate] = useState(currDate); 
    const [check, setCheck] = useState(true);

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

    function removeTaskForm(e) {
        e.preventDefault(); 
        setAddWorkClicked(false); 
        setAddLifeClicked(false); 
    }

    function handleAddTask(e) {
        e.preventDefault();
        console.log(taskDate); 
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

    function displayTaskForm(category) {
        return (
        <div>
            <h2>{category}</h2>
            <form id={category} onSubmit={handleAddTask}>
                <label>Task Name</label>
                <input type="text" required></input>
                
                <label>Task Description</label>
                <input type="text"></input>

                <label>Date</label>
                <input type="date" placeholder="yyyy-mm-dd" defaultValue={taskDate} min={currDate}
                onChange={e => setTaskDate(e.target.value)} requiredPattern="\d{4}-\d{2}-\d{2}" required></input>
                
                {/* <label for='want-reminder'> */}
                    <input type='checkbox' value='want-reminder' id='want-reminder' onChange= {isChecked}/> Set Reminders 
                {/* //</label>  */}
                <div id="rem-interval" style={{display: 'none'}}>
                    <input type='checkbox' name='rem-freq' id='10-min'/> 10 min 
                    <input type='checkbox' name='rem-freq' id='30-min'/> 30 min 
                    <input type='checkbox' name='rem-freq' id='1-hour'/> 1 hour before
                    <input type='checkbox' name='rem-freq' id='3-hours'/> 3 hours before
                    <input type='checkbox' name='rem-freq' id='1-day'/> 1 day before
                    <input type='checkbox' name='rem-freq' id='3-days'/> 3 days before
                    <input type='checkbox' name='rem-freq' id='one-week'/> 1 week before
                    <input type='checkbox' name='rem-freq' id='one-week'/> 2 weeks before
                </div>

                    <button id="submit-task-button">Submit</button>
                <button id="cancel-task-button" onClick={removeTaskForm}>Cancel</button> 
            </form>
            <button id="cancel-task-button" onClick={removeTaskForm}>Cancel</button>
        </div>
        )
    }

    return (
        <div id="add-task-bar">
                <label for="add-task"><h1 id="add-task">+ Add Task</h1></label>
                <button id="work-button" onClick={showWorkTaskForm}>Work</button>
                <button id="life-button" onClick={showLifeTaskForm}>Life</button>
                {addWorkClicked && displayTaskForm("work-task-form")}
                {addLifeClicked && displayTaskForm("life-task-form")}
        </div>
    )
}

export default RightDashboard; 