import React, { useEffect, useState } from 'react'; 
import { useAuth } from '../contexts/AuthContexts'; 
import { db } from '../firebase';  
import Moment from 'moment';


function Meter() {
    const { currentUser } = useAuth(); 
    const userTasks = db.collection('users').doc(currentUser.uid); 
    const [workTime, setWorkTime] = useState(0); 
    const [lifeTime, setLifeTime] = useState(0); 

    useEffect(() => {
        userTasks.onSnapshot(doc => {
            const w = doc.data().workTime; 
            const l = doc.data().lifeTime; 
            setWorkTime(w);
            setLifeTime(l); 
        })
    }, [])

    return (
        <div>
            <p>{workTime}/{lifeTime}</p> 
            {/* <div className="donut" style={"--first": .40; "--second": .33;}>
            <div className="donut__slice donut__slice__first"></div>
            <div className="donut__slice donut__slice__second"></div>
            <div className="donut__label">
                <div className="donut__label__heading">
                CSSScript.Com
                </div>
                <div className="donut__label__sub">
                Donut Chart
                </div>
            </div> */}
            {/* </div>   */}
        </div>
    )
}

export default Meter;