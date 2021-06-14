import CenterDashboard from './CenterDashboard'; 
import LeftDashboard from './LeftDashboard';
import RightDashboard from './RightDashboard'; 
import { useEffect, useState } from 'react'; 
import { useHistory } from 'react-router-dom'; 
import { useAuth } from '../contexts/AuthContexts'; 
import { db } from '../firebase'; 


function Dashboard() {
    const currDate = new Date().toLocaleDateString('en-CA');
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

    return (
        <div className="dash">
            {/* Left */}
            <LeftDashboard /> 
            {/* Center */}
            <CenterDashboard tasks={tasks} setTasks={setTasks}/>
            {/* Right */}
            <RightDashboard tasks={tasks}/> 
        </div>
    )
}

export default Dashboard; 