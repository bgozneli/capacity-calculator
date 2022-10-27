import { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import dayjs from "dayjs";
import * as config from "./config/index";
import { Tooltip } from 'bootstrap';
const historicalDb = require("./db/historical.json");
const calculateCapacity = require('./services/calculateCapacity');

function App() {
  const state = {
    currentSprintStats: {
      noOfSprintWeeks: 0,
      noOfDevs: 0,
      sprintStartDate: "",
      sprintEndDate: "",
    },
    previousSprintStats: {
      numberOfPeople: 0,
      storyPoints: 0,
      capacity: 0,
    },
 //   team: "Batman",
  };

  const [noOfDevs, setNoOfDevs] = useState("0");
  let [sprintStartDate, setSprintStartDate] = useState("");
  let [noOfSprintWeeks, setSprintWeeks] = useState("2");
  let [sprintEndDate, setSprintEndDate] = useState("");
  const [lastSprintCapacity, setlastSprintCapacity] = useState("0");
  const [lastSprintBurnDownPoints, setLastSprintBurnDownPoints] = useState("0");
  const [lastSprintNoOfDevs, setLastSprintNoOfDevs] = useState("0");
  const [team, setTeam] = useState("");
  const [visible, setVisible] = useState(false);
  const [sprintVelocity, setSprintVelocity] = useState(0);
  const [historicalData, setHistoricalData] = useState([]);


  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl));
// checkIfHistoricalDataExist(team);
  });


  const handleSubmit = async (event) => {
    event.preventDefault();
    state.currentSprintStats.noOfDevs = parseInt(noOfDevs);
    state.currentSprintStats.noOfSprintWeeks = parseInt(noOfSprintWeeks);
    state.currentSprintStats.sprintStartDate = sprintStartDate;
    //calculateAndSetSprintEndDate(state.currentSprintStats.sprintStartDate);
    state.currentSprintStats.sprintEndDate = sprintEndDate;
    state.previousSprintStats.capacity = parseInt(lastSprintCapacity);
    state.previousSprintStats.storyPoints = parseInt(lastSprintBurnDownPoints);
    state.previousSprintStats.numberOfPeople = parseInt(lastSprintNoOfDevs);
    state.team = team;
    const value = await calculateCapacity(state);
    console.log(state);
    setSprintVelocity(value);
  };

  const calculateAndSetSprintEndDate = (startDate) => {
    const weekToNoOfDayMap = config.weekToNoOfDayMap;
    const endDate = dayjs(startDate)
      .add(weekToNoOfDayMap[noOfSprintWeeks], "day")
      .format("YYYY-MM-DD");
    state.currentSprintStats.sprintEndDate = endDate;
    setSprintEndDate(endDate);
  };

  const checkIfHistoricalDataExist = (teamName) => {
    // console.log(`team value ${teamName}`);
    const historicalRecords = historicalDb.filter((record) => record.team === teamName);
    setHistoricalData(historicalRecords);
    const historicalDataExists = historicalDb.find(
      (data) => data.team === teamName
    );
    if (historicalDataExists) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };



  const renderHistoricalDataTable = () => {
    const rows = historicalData.map((record) => {
      return (
        <tr>
          <td>{record.numberOfPeople}</td>
          <td>{record.storyPoints}</td>
          <td>{record.capacity}</td>
          <td>{record.team}</td>
        </tr>
      )
    });
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>No of Devs</th>
            <th>BurnDown Points(Total amount of achieved story points)</th>
            <th>Capacity</th>
            <th>Team</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
    );
  }


  return (
    <div className="container">
      <h1>
        <b>Sprint Capacity Calculator</b>
      </h1>
      <br />
      <div className="mb-3">
        <p>
          <b>Select Team</b>
        </p>

        <select
          id="team"
          value={team}
          onChange={(e) => {
            setTeam(e.target.value);
            checkIfHistoricalDataExist(e.target.value);
          }}
          className="form-select"
        >
          <option disabled  value="">-- Select a Team --</option>
          <option value="Batman">Batman</option>
          <option value="Joker">Joker</option>
          <option value="Thor">Thor</option>
          <option value="Loki">Loki</option>
          <option value="Groot">Groot</option>
          <option value="CaptainMarvel">CaptainMarvel</option>
        </select>
      </div>
      <p>
        <b>Current Sprint Capacity</b>
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="sprintWeeks" className="form-label">
            Sprint Weeks:
          </label>
          <select
            id="sprintWeeks"
            value={noOfSprintWeeks}
            onChange={(e) => {
              setSprintWeeks(e.target.value);
              if (sprintStartDate) {
                calculateAndSetSprintEndDate(e.target.value);
              }
            }}
            className="form-select"
          >
            <option value="2">2 Weeks</option>
            <option value="3">3 Weeks</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="DevsCount" className="form-label">
            Number of engineers:
          </label>
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
          <label htmlFor="StartDate" className="form-label">
            Start Date:
          </label>
          <input
            className="form-control"
            id="StartDate"
            type="date"
            value={sprintStartDate}
            min="{new Date()}"
            onChange={(e) => {
              setSprintStartDate(e.target.value);
              calculateAndSetSprintEndDate(e.target.value);
            }}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="endDate" className="form-label">
            End Date:
          </label>
          <input
            id="endDate"
            className="form-control"
            disabled
            type="date"
            value={sprintEndDate}
          />
        </div>

        <br />
        <div style={{ display: visible ? "block" : "none" }} >
          <p>
            <b>Historical Sprint Metrics</b>
          </p>
          {renderHistoricalDataTable()}
        </div>
        <div>
          <p>
            <b>Previous Sprint Details</b>
          </p>

          <div className="mb-3">
            <label htmlFor="PreviousSprintCapacity" className="form-label" data-bs-toggle="tooltip" data-bs-title="Number of working days" data-bs-placement="right">
              Sprint Capacity:
            </label>
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
            <label
              htmlFor="PreviousSprintBurnDownPoints"
              className="form-label"
              data-bs-toggle="tooltip" data-bs-title="Total amount of achieved story points" data-bs-placement="right"
            >
              BurnDown Points:
            </label>
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
            <label htmlFor="PreviousSprintNoOfDevs" className="form-label">
              Number of engineers:
            </label>
            <input
              className="form-control"
              id="PreviousSprintNoOfDevs"
              type="number"
              min="0"
              value={lastSprintNoOfDevs}
              onChange={(e) => setLastSprintNoOfDevs(e.target.value)}
            />
          </div>
        </div>
        <input
          type="submit"
          value="Calculate"
          className="btn btn-primary mb-3"
        />
      </form>
      <div className="row">
        <div className="col d-flex aligns-items-center justify-content-center">
          <label className="form-label sprint-velocity-label">Sprint Velocity</label>
        </div>
      </div>
      <div className="row">
        <div className="col d-flex aligns-items-center justify-content-center">
          <div className="circle">{sprintVelocity}</div>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
}

export default App;