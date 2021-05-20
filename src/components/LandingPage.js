import { Link } from 'react-router-dom';


function LandingPage() {
    return (
        <div className='landing-page'>
            <nav className='nav-bar'>
                <ul>
                    <li><Link to='/login'>Login</Link></li>{/*link*/}
                    <li>Home</li> {/*link*/}
                </ul>
            </nav>
            {/* Some other random text propaganda */}
        </div>
    )
}

export default LandingPage; 