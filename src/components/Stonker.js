import Chart from 'react-apexcharts';
import { db } from '../firebase'; 
import { useAuth } from '../contexts/AuthContexts';
import { useState, useEffect } from 'react'; 

function Stonker(props) {
    const { currentUser } = useAuth(); 
    const { target } = props; 
    const userTasks = db.collection("users").doc(currentUser.uid);
    const [dataSet, setDataSet] = useState([]); 
    const [workSet, setWorkSet] = useState([]); 
    const [playSet, setPlaySet] = useState([]); 
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight); 
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);
    
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
        // const container = document.getElementsByClassName('App'); 
        // const w = container[0].getBoundingClientRect().width;
        // const h = container[0].getBoundingClientRect().height;
        const isMobile = width <= 1024; 
        if (isMobile) {
            return [Math.round(height * 0.5), Math.round(width * 0.9)];
        } else {
            console.log([Math.round(height * 0.5), Math.round(width * 0.4)]);
            return [Math.round(height * 0.5), Math.round(width * 0.4)];
        }
        
    }

    const setting = {
        options: {
            annotations: {
                yaxis: [
                  {
                    y: target === undefined ? 0 : target[0],
                    y2: target === undefined ? 0 : target[1],
                    borderColor: '#000',
                    fillColor: '#FFFACD',
                    label: {
                      style: {
                        color: 'whitesmoke',
                        background: 'black',
                      },
                      text: target === undefined ? 'No target range': 'Your target work range'
                    }
                  }
                ]
              },
          colors: ['#8a5858'],
          chart: {
            id: "stonks",
            toolbar: false,
          },
          dataLabels: {
            style: {
              colors: ['red', 'blue', 'green']
            }
          },
          xaxis: {
            labels: {
                style: {
                    colors: 'whitesmoke'
                }
              },
            categories: ['One month ago', '', '', '', 'This week']
          },
          yaxis: {
              labels: {
                style: {
                    colors: 'whitesmoke'
                }
              }
          },
          stroke: {
            curve: 'smooth'
          },
        },
        series: [
            {
                name: "work",
                data: workSet
            },
          ],
      };

    return (
        <div className='stonker'>
            <div className='header'>Weekly Progress</div>
            <div className='caption'>*This chart shows the percentage of <span style={{color: '#8a5858'}}>work</span> you did relative to all the time you've spent on each event!</div>
            <div style={{alignSelf: 'center', color: 'black'}}>
                <Chart 
                    options={setting.options}
                    series={setting.series}
                    type='line'
                    height= {getStonkDimensions()[0]}
                    width= {getStonkDimensions()[1]}
                />
            </div>
        </div>
    )
}

export default Stonker; 