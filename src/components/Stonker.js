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
            });     
    }, []); 

    useEffect(() => {
        setWorkSet(convertToWork()); 
        setPlaySet(convertToPlay()); 
    }, [dataSet])

    function convertToWork() {
        const arr = dataSet;
        console.log('converting to work');
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
        console.log('converting to play');
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

    function getStonkDimensions() {
        const container = document.getElementsByClassName('App'); 
        const w = container[0].getBoundingClientRect().width;
        const h = container[0].getBoundingClientRect().height;
        return [h * 0.50, w * 0.4];
    }

    const setting = {
        options: {
        colors: ['#8a5858', '#eddfc2'],
          chart: {
            id: "stonks"
          },
          xaxis: {
            categories: ['', '', '', '', '']
          }
        },
        series: [
            {
                name: "work-stonks",
                data: workSet
            },
            {
                name: "play-stonks",
                data: playSet,
              }
          ],
          stroke: {
            curve: 'smooth'
          },
      };
    return (
        <div className='stonker'>
            <Chart 
                options={setting.options}
                series={setting.series}
                type='line'
                height= {getStonkDimensions()[0]}
                width= {getStonkDimensions()[1]}
            />
        </div>
    )
}

export default Stonker; 