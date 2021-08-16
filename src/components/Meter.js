import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { db } from "../firebase";
import DonutChart from "react-donut-chart";

function Meter() {
  const { currentUser } = useAuth();
  const userTasks = db.collection("users").doc(currentUser.uid);
  const [workTime, setWorkTime] = useState(0);
  const [lifeTime, setLifeTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [hovered, setHovered] = useState("");

  useEffect(() => {
    userTasks.onSnapshot((doc) => {
      if (doc.exists) {
        const w = doc.data().workTime;
        const l = doc.data().lifeTime;
        const t = w + l;
        setLifeTime(l);
        setWorkTime(w);
        setTotalTime(t);
      }
    });
  }, []);

  function enterMeter(item) {
    return totalTime === 0 
      ? setHovered('')
      : item.label === 'work' 
        ? setHovered('Work') 
        : setHovered('Play')
  }

  function getValueFormat(values, total) {
    if (!hovered || total === 0) {
      return "";
    } else {
      return `${(values * 2 / total * 100).toFixed(1)}%`;
    }
  }

  return (
    <div className='meter'>
    <p>{hovered}</p>
      <DonutChart
        data={[
          {
            label: "work",
            value: workTime,
            className: "workmeter"
          },
          {
            label: "life",
            value: lifeTime,
            className: "meter"
          },
          {
              label:'',
              value: totalTime,
          }
        ]}
        height={100}
        width={200}
        startAngle={180}
        legend={false}
        colors={['#8a5858','#eddfc2']}
        strokeColor={['#ffffff', '#ffffff']}
        colorFunction={(colors, index) => colors[(index % colors.length)]}
        formatValues={getValueFormat}
        clickToggle={false}
        onMouseEnter={(item) => {enterMeter(item)}}
      />
        {totalTime === 0 && <div className='meter-caption'><p>No tasks for the week, add some to get started!</p></div>}
      
    </div>
  );
}

export default Meter;
