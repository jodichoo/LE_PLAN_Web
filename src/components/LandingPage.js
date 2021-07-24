import { Link } from 'react-router-dom';
import { useState } from 'react';
import Contact from './Contact';

function LandingPage() {
    const [home, setHome] = useState(true);

    return (
        <div id='landing-page'> 
            {home 
                ? <div className='logo-spacing'></div> 
                : <img className='small-logo' src="https://cdn.discordapp.com/attachments/639487542432890900/867690623191351296/applogo.png" alt='oops'></img>}
            <div className='nav-bar'>
                <div className='nav-bar-element' style={{borderBottom: home ? '2px solid whitesmoke' : 'none'}} onClick={() => setHome(true)}>HOME</div>
                <div className='nav-bar-element'>
                    <Link to='/login'>LOG IN</Link>
                </div>
                <div className='nav-bar-element' style={{borderBottom: home ? 'none' : '2px solid whitesmoke'}} onClick={() => setHome(false)}>CONTACT</div>
            </div>
            {home 
            ? <><img className='home-logo' src="https://cdn.discordapp.com/attachments/639487542432890900/867690623191351296/applogo.png" alt='oops'></img>
            <Link className='sign-up-button' to='/signup'>JOIN US</Link> </>

            : <Contact />}
        </div>
    )
}

export default LandingPage; 