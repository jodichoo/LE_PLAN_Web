import { Link } from 'react-router-dom';


function LandingPage() {
    return (
        <div id='landing-page'> 
                <nav className='nav-bar'>
                    <ul>
                        <li><Link to='/login' id="login-link" style={{textDecoration: 'none'}}>Login</Link></li>
                        <li>Home</li>
                    </ul>
                </nav>
            {/* Some other random text propaganda */}
            <div id="apology">
                <p>
                    Hello World.<br />
                    Sry homepage design is still a work in progress T_T
                    Sry homepage design is still a work in progress T_T
                    Sry homepage design is still a work in progress T_T
                </p>
            </div>
        </div>
    )
}

export default LandingPage; 