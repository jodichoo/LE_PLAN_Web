import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';
import { useState, useEffect } from 'react';
import Contact from './Contact';

function LandingPage() {
    const [home, setHome] = useState(true);

    return (
        <div id='landing-page'> 
            {home ? <div style={{height: "100px", marginTop: '20px'}}></div> : <img style={{width: 'auto', height: '100px', marginTop: '20px'}} src="https://cdn.discordapp.com/attachments/639487542432890900/867690623191351296/applogo.png" alt='oops'></img>}
            <div className='nav-bar'>
                <div className='nav-bar-element' onClick={() => setHome(true)}>HOME</div>
                <div className='nav-bar-element'>
                    <Link to='/login'>LOG IN</Link>
                </div>
                <div className='nav-bar-element' onClick={() => setHome(false)}>CONTACT</div>
            </div>
            {home 
            ? <><img className='home-logo' src="https://cdn.discordapp.com/attachments/639487542432890900/867690623191351296/applogo.png" alt='oops'></img>
            <Link className='sign-up-button' to='/signup'>JOIN US</Link> </>

            : <Contact />}
        </div>
    )
}

export default LandingPage; 