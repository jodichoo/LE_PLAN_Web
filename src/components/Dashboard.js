import CenterDashboard from './CenterDashboard'; 
import LeftDashboard from './LeftDashboard';
import RightDashboard from './RightDashboard'; 
import { useEffect, useState } from 'react'; 
import { useHistory } from 'react-router-dom'; 
import { useAuth } from '../contexts/AuthContexts'; 
import { db } from '../firebase'; 


function Dashboard() {
    const { currentUser, logout, username } = useAuth();
    const [error, setError] = useState('');
    const history = useHistory();
    const userTasks = db.collection('users').doc(currentUser.uid);
    const [greetName, setGreetName] = useState('empty'); 
    const [date,setDate] = useState(new Date());
        
    useEffect(() => {
        var timer = setInterval(() => setDate(new Date()), 1000 )
            return function cleanup() {
                clearInterval(timer)
            }
    }, []);

    function convertGreet(num) {
        const time = parseInt(num.toLocaleTimeString('en-GB').split(':')[0]);
        console.log(time);
        if (time < 12) {
            return 'Good Morning';
        } else if (time < 17) {
            return "Good Afternoon";
        } else if (time < 24) {
            return 'Good Evening';
        } else {
            return "HAHAHAHAHAAH"
        }
    }

    async function handleLogOut() {
        setError(""); 
        try {
            await logout()
            history.push('/login'); 
        } catch {
            setError('Failed to log out'); 
        }
    }

    //get the username for custom greeting 
    useEffect(() => {
        userTasks.get().then(doc => {
            if (doc.exists) {
                const unsubscribe = setGreetName(doc.data().username);
                return unsubscribe; 
            } else {
                const unsubscribe = userTasks.set({
                    username: username
                })
                setGreetName(username);  
                return unsubscribe; 
            }
        })
    }, [])

    return (
        <div>
            <h1>{date.toLocaleTimeString()} {convertGreet(date)}, {greetName}!</h1>
            <h2>Here are your tasks for {date.toLocaleDateString()} ecksdee ecksdee</h2>
            {/* logout button  */}
            {error && <p>{error}</p>}
            <button onClick={handleLogOut}>Log Out</button>
            {/* Left */}
            <LeftDashboard /> 
            {/* Center */}
            <CenterDashboard />
            {/* Right */}
            <RightDashboard /> 
        </div>
    )
}

export default Dashboard; 