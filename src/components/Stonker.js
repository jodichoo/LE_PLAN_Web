import Chart from 'react-apexcharts';
import { db, auth } from '../firebase'; 
import { useAuth } from '../contexts/AuthContexts';
import { useState, useEffect } from 'react'; 

function Stonker() {
    const { currentUser } = useAuth(); 
    const userTasks = db.collection("users").doc(currentUser.uid);
    const [dataSet, setDataSet] = useState([]); 
    // const [loading, setLoading] = useState(true); 
    const [workSet, setWorkSet] = useState([]); 
    const [playSet, setPlaySet] = useState([]); 
    // var workCount; 
    // var lifeCount; 
    
    useEffect(() => {
        userTasks.get()
            .then(doc => {
                console.log('getting the data'); 
                const temp = doc.data().stonksData
                const arr = []; 
                for (var i = 0; i < temp.length; i++) {
                    arr.push(temp[i]); 
                }
                const workCount = doc.data().workTime;
                const lifeCount = doc.data().lifeTime;
                const dataItem = workCount === 0 && lifeCount === 0 
                    ? -1
                    : 100 * parseFloat(workCount)/ (parseFloat(workCount) + parseFloat(lifeCount))
                console.log(workCount, lifeCount, dataItem);
                arr.push(Math.round(dataItem * 100) / 100);
                console.log(arr);
                console.log(Math.round(dataItem * 100) / 100);
                setDataSet(arr); 
            })
            .then(() => {
                setWorkSet(convertToWork()); 
                setPlaySet(convertToPlay()); 
            });     
    }, []); 

    function convertToWork() {
        const arr = dataSet;
        const converted = [];
        for (var i = 0; i < dataSet.length; i++) {
            if (arr[i] < 0) {
                converted.push(0);
            } else {
                converted.push(arr[i]);
            }
        }
        return converted;
    }

    function convertToPlay() {
        const arr = dataSet; 
        const converted = []; 
        for (var i = 0; i < dataSet.length; i++) {
            const curr = arr[i]; 
            if (curr === -1) {
                converted.push(0); 
            } else {
                const n = 100 - parseFloat(curr);
                converted.push(Math.round(n * 100) / 100);
            }
        }
        return converted; 
    }

    const setting = {
        options: {
          chart: {
            id: "stonks"
          },
          xaxis: {
            categories: ['', '', '', '']
          }
        },
        series: [
            {
              name: "play-stonks",
              data: playSet
            },
            {
                name: "work-stonks",
                data: workSet
            }
          ],
          stroke: {
            curve: 'smooth'
          },
      };
    return (
        <div>
            <Chart 
                options={setting.options}
                series={setting.series}
                type='line'
                width='500'
            />
        </div>
    )
}

export default Stonker; 