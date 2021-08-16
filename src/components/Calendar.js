import moment from "moment";
import '../styles/Calendar.css';
import { useEffect, useState } from "react";

function Calendar(props) {
  const [currDate, setCurrDate] = useState(moment().format("YYYY-MM-DD"));
  const { selectedDate, setSelectedDate } = props; 
  const [dateArr, setDateArr] = useState([]); 
  const [dateInput, setDateInput] = useState(selectedDate); 

  useEffect(() => {
    var timer = setInterval(() => setCurrDate(moment().format("YYYY-MM-DD")), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    setDateArr(getDates()); 
  }, [currDate]); 

  //get array of dates to be shown 
  function getDates() {
    const arr = []; 
    const today = moment().format('YYYY-MM-DD'); 
    for (var i = 0; i < 7; i++) {
      const temp = moment(today).add(i, 'days'); 
      arr.push(temp.format('YYYY-MM-DD')); 
    }
    return arr; 
  }

  function handleDateClicked(e, date) {
    e.preventDefault(); 
    setSelectedDate(date); 
  }

  function getLabel(date) {
    const daysArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; 
    //get the day of the week 
    const dayIndex = moment(date).day(); 
    return daysArr[dayIndex]; 
  }

  function renderDates(date, index) {
    var bord = 'none'
    var bg = 'transparent'; 
    var col = 'black'; 
    var rad = 0; 
    if (selectedDate === date) {
      bg = 'black'; col = 'white'; rad = '26px'; bord = '1px solid black'
    }
    return (
      <div className='date' style={{backgroundColor: bg, color: col, borderTopLeftRadius: rad, borderBottomLeftRadius: rad, border: bord}} 
          onClick={e => {handleDateClicked(e, date)}}>
          {index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : getLabel(date)}
      </div>
    )
  }

  function handleCalendarSubmit(e) {
    e.preventDefault(); 
    setSelectedDate(dateInput); 
  }

  return (
    <div className="left-dash">
      <div className='other-date-select'>
        <label>Select a date:</label>
        <div className='fields'>
          <input type='date' placeholder="yyyy-mm-dd" defaultValue={selectedDate} min={currDate}
                  onChange={e => setDateInput(e.target.value)} requiredpattern="\d{4}-\d{2}-\d{2}"></input>
          <button onClick={e => handleCalendarSubmit(e)}>Go</button>
        </div>
      </div>
      <div className='dates-container'>
        {dateArr.map((date, index) => (
          renderDates(date, index)
        ))}
      </div>
    </div>
  );
}

export default Calendar;