import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContexts";
import { db } from "../firebase";
import Moment from "moment";
import CustomProperties from "react-custom-properties";
import DonutChart from "react-donut-chart";

function Meter() {
  const { currentUser } = useAuth();
  const userTasks = db.collection("users").doc(currentUser.uid);
  const [workTime, setWorkTime] = useState(0);
  const [lifeTime, setLifeTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [workRatio, setWorkRatio] = useState(0);
  const [lifeRatio, setLifeRatio] = useState(0);

  useEffect(() => {
    userTasks.onSnapshot((doc) => {
      const w = doc.data().workTime;
      const l = doc.data().lifeTime;
      const t = w + l;
      setLifeTime(l);
      setWorkTime(w);
      setLifeTime(t);
      setWorkRatio((workTime / totalTime) * 100 / 2);
      setLifeRatio((lifeTime / totalTime) * 100 / 2);
    });
  }, []);

  return (
    <div>
      <DonutChart
        data={[
          {
            label: "work",
            value: 20,
            className: "work-meter"
          },
          {
            label: "life",
            value: 30,
            className: "life-meter"
          },
          {
              label:'',
              value: 50,
          }
        ]}
        height={150}
        width={300}
        startAngle={180}
        legend={false}
        colors={['#f5efef','rosybrown']}
      />
      <CustomProperties
        properties={{
          "--first": "workRatio",
          "--second": "lifeRatio",
        }}
      >
        <div className="donut">
          <div className="donut__slice donut__slice__first"></div>
          <div className="donut__slice donut__slice__second"></div>
          <div className="donut__label">
            <div className="donut__label__heading">
              Meter {workTime}/{lifeTime}
            </div>
            <div className="donut__label__sub">wOW aMaZInG!!</div>
          </div>
        </div>
      </CustomProperties>
    </div>
  );
}

export default Meter;
