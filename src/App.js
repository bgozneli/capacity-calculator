import { useState } from "react";
import ReactDOM from 'react-dom/client';
import dayjs from "dayjs";
import * as config from './config/index';


function App() {
  const state = {
    currentSprintStats : {
      noOfSprintWeeks: 0,
      noOfDevs: 0,
      sprintStartDate:'',
      sprintEndDate: '',
    },
    previousSprintStats: {
      numberOfPeople: 0,
      storyPoints: 0,
      capacity: 0,
    },
  };
  const [noOfDevs, setNoOfDevs] = useState('');
  let [sprintStartDate, setSprintStartDate] = useState('');
  let [noOfsprintWeeks, setSprintWeeks] = useState('');
  let [sprintEndDate] = useState('');
  const [lastSprintCapacity, setlastSprintCapacity] = useState('');
  const [lastSprintBurnDownPoints, setLastSprintBurnDownPoints] = useState('');
  const [lastSprintNoOfDevs, setLastSprintNoOfDevs] = useState('');
  
  
  noOfsprintWeeks = '2';

  const handleSubmit = (event)=>{
    event.preventDefault();
    state.currentSprintStats.noOfDevs = parseInt(noOfDevs);
    state.currentSprintStats.noOfSprintWeeks = parseInt(noOfsprintWeeks);
    state.currentSprintStats.sprintStartDate = sprintStartDate;
    calculateAndSetSprintEndDate(state.currentSprintStats.sprintStartDate);
    state.currentSprintStats.sprintEndDate = sprintEndDate;
    state.previousSprintStats.capacity = parseInt(lastSprintCapacity);
    state.previousSprintStats.storyPoints = parseInt(lastSprintBurnDownPoints);
    state.previousSprintStats.numberOfPeople = parseInt(lastSprintNoOfDevs);
    console.log(state);
  }

  const calculateAndSetSprintEndDate = (startDate) => {
    const weekToNoOfDayMap = config.weekToNoOfDayMap;
    const endDate = dayjs(startDate).add(weekToNoOfDayMap[state.currentSprintStats.noOfSprintWeeks], 'day').format('YYYY-MM-DD');
    state.currentSprintStats.sprintEndDate = endDate;
    sprintEndDate = endDate;
  }


  return (
    <form onSubmit={handleSubmit}>
      <div>
      <label>Capacity Calculator</label>
      </div>
      <div>
      <label>Current Sprint Capacity</label>
      </div>
      <div>
      <label htmlFor="sprintWeeks">
          Pick Sprint Weeks:
          <select id="sprintWeeks" value={noOfsprintWeeks} onChange={(e)=>setSprintWeeks(e.target.value)}>
            <option value="2">2 Weeks</option>
            <option value="3">3 Weeks</option>
          </select>
        </label>
        <br></br>
      <label htmlFor="DevsCount">Enter no of Devs:
        <input
          id="DevsCount"
          type="number" 
          min="0"
          value={noOfDevs}
          onChange={(e)=> setNoOfDevs(e.target.value)}
        />
      </label>
      <br></br>
      <label htmlFor="StartDate">Enter Sprint Start Date:
        <input
        id="StartDate"
          type="date" 
          value={sprintStartDate}
          onChange={(e)=> setSprintStartDate(e.target.value)}
        />
      </label>
      <label>Sprint End Date:
        <input
          disabled
          type="date" 
          value={sprintEndDate}
        />
      </label>
      </div>
      <div>
        Last Sprint Details
        <br></br>
        <label htmlFor="PreviousSprintCapacity">
          SprintCapacity : 
          <input
          id="PreviousSprintCapacity"
          type="number" 
          min="0"
          value={lastSprintCapacity}
          onChange={(e)=> setlastSprintCapacity(e.target.value)}
        />
        </label>
        <br></br>
        <label htmlFor="PreviousSprintBurnDownPoints">
          BurnDown Points : 
          <input
          id="PreviousSprintBurnDownPoints"
          type="number" 
          min="0"
          value={lastSprintBurnDownPoints}
          onChange={(e)=> setLastSprintBurnDownPoints(e.target.value)}
        />
        </label>
        <br></br>
        <label htmlFor="PreviousSprintNoOfDevs">
          No of Devs : 
          <input
          id="PreviousSprintNoOfDevs"
          type="number" 
          min="0"
          value={lastSprintNoOfDevs}
          onChange={(e)=> setLastSprintNoOfDevs(e.target.value)}
        />
        </label>
      </div>
      <input type="submit" value="Submit"/>
    </form>
  )
}

export default App;