import CenterDashboard from './CenterDashboard'; 
import LeftDashboard from './LeftDashboard';
import RightDashboard from './RightDashboard'; 

function Dashboard() {
    return (
        <div>
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