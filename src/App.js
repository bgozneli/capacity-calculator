import { useState } from "react";
import ReactDOM from 'react-dom/client';
import dayjs from "dayjs";
import * as config from './config/index';


function App() {
  const state = {
    currentSprintStats: {
      noOfSprintWeeks: 0,
      noOfDevs: 0,
      sprintStartDate: '',
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

  const handleSubmit = (event) => {
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
    <div className="container">
      <h1><b>Capacity Calculator</b></h1>
      <br />
      <p><b>Current Sprint Capacity</b></p>
      <form onSubmit={handleSubmit}  >

        <div className="mb-3">
          <label htmlFor="sprintWeeks" className="form-label" >Sprint Weeks:</label>
          <select id="sprintWeeks" value={noOfsprintWeeks} onChange={(e) => setSprintWeeks(e.target.value)} className="form-select">
            <option value="2">2 Weeks</option>
            <option value="3">3 Weeks</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="DevsCount" className="form-label">Number of engineers:</label>
          <input
            id="DevsCount"
            type="number"
            min="0"
            className="form-control"
            value={noOfDevs}
            onChange={(e) => setNoOfDevs(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="StartDate" className="form-label">Start Date:</label>
          <input
            className="form-control"
            id="StartDate"
            type="date"
            value={sprintStartDate}
            onChange={(e) => setSprintStartDate(e.target.value)}
          />
        </div>


        <div className="mb-3">
          <label htmlFor="endDate" className="form-label">End Date:</label>
          <input
            id="endDate"
            className="form-control"
            disabled
            type="date"
            value={sprintEndDate}
          />
        </div>

        <br />
        <p><b>Previous Sprint Details</b></p>

        <div className="mb-3">
          <label htmlFor="PreviousSprintCapacity" className="form-label">Sprint Capacity:</label>
          <input
            className="form-control"
            id="PreviousSprintCapacity"
            type="number"
            min="0"
            value={lastSprintCapacity}
            onChange={(e) => setlastSprintCapacity(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="PreviousSprintBurnDownPoints" className="form-label">BurnDown Points:</label>
          <input
            className="form-control"
            id="PreviousSprintBurnDownPoints"
            type="number"
            min="0"
            value={lastSprintBurnDownPoints}
            onChange={(e) => setLastSprintBurnDownPoints(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="PreviousSprintNoOfDevs" className="form-label">Number of engineers:</label>
          <input
            className="form-control"
            id="PreviousSprintNoOfDevs"
            type="number"
            min="0"
            value={lastSprintNoOfDevs}
            onChange={(e) => setLastSprintNoOfDevs(e.target.value)}
          />
        </div>
        <input type="submit" value="Calculate" className="btn btn-primary mb-3" />
      </form>
    </div>
  )

}

export default App;