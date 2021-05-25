import CenterDashboard from './CenterDashboard'; 
import LeftDashboard from './LeftDashboard';
import RightDashboard from './RightDashboard'; 
import { useState } from 'react'; 
import { useHistory } from 'react-router-dom'; 
import { useAuth } from '../contexts/AuthContexts'; 

function Dashboard() {
    const { currentUser, logout } = useAuth();
    const [error, setError] = useState('');  
    const history = useHistory();

    async function handleLogOut() {
        setError(""); 
        try {
            await logout()
            history.push('/login'); 
        } catch {
            setError('Failed to log out'); 
        }
    }
    return (
        <div>
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