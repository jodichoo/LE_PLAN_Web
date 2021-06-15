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
    if (index === 0) {
      //display option as 'today' 
      return (
        <div className='date' onClick={e => {handleDateClicked(e, date)}}>
          Today
        </div>
      )
    } else {
      return (
        <div className='date' onClick={e => {handleDateClicked(e, date)}}>
          {date}
        </div>
      )
    }
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