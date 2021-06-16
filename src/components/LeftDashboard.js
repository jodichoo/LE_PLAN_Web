import moment from "moment";
import { useEffect, useState } from "react";

function LeftDashboard(props) {
  const { selectedDate, setSelectedDate } = props; 
  const [dateArr, setDateArr] = useState([]); 

  useEffect(() => {
    setDateArr(getDates()); 
  }, []); 

  //get array of dates to be shown 
  function getDates() {
    const arr = []; 
    const today = moment().format('YYYY-MM-DD'); 
    for (var i = 0; i < 7; i++) {
      const temp = moment(today).add(i, 'days'); 
      arr.push(temp.format('YYYY-MM-DD')); 
    }
    console.log(arr);
    return arr; 
  }

  function handleDateClicked(e, date) {
    e.preventDefault(); 
    setSelectedDate(date); 
  }

  function renderDates(date, index) {
    var bg = 'transparent'; 
    var col = 'whitesmoke'; 

    if (selectedDate === date) {
      bg = '#f3eee9';
      col = 'black';
    }
    
    return (
      <div className='date' style={{backgroundColor: bg, color: col}} 
          onClick={e => {handleDateClicked(e, date)}}>
          {index === 0 ? 'Today' : date}
      </div>
    )
  }

  return (
    <div className="left-dash">
      <div>
        <h1>Calendar</h1>
      </div>
      <div className='dates-container'>
        {dateArr.map((date, index) => (
          renderDates(date, index)
        ))}
      </div>
    </div>
  );
}

export default LeftDashboard;