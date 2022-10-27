const getPublicHolidays = require("../api/publicHolidayApi");
const getHolidaysForTeam = require("../api/calendarApi");
const getBurntDownSprintInformationForTeam = require("../api/jiraApi");
const db = require("../db/historical.json");

const calculate = async (request) => {
    let totalSprintCapacitySum = request.previousSprintStats.capacity;
    let bspSum = await getBurntDownSprintInformationForTeam(request.team) + request.previousSprintStats.storyPoints;
    const teamMembers = request.currentSprintStats.noOfDevs;
    let filteredDb = db.filter((history) => history.team === request.team
    );
    let dbLength = filteredDb.length + 1;

    const publicHoliday = await getPublicHolidays(new Date().getFullYear());
    const teamDaysOff = countIterationHolidays(
        request.currentSprintStats.sprintStartDate,
        request.currentSprintStats.noOfSprintWeeks,
        publicHoliday,
        request.team
    );

    filteredDb.forEach(function (item) {
        bspSum += item.storyPoints
        totalSprintCapacitySum += item.capacity;
    });

    const bsp = bspSum / dbLength;
    const totalLastSprintCapacity = totalSprintCapacitySum / dbLength;

    return Math.round((((teamMembers * (14 - teamDaysOff.publicHolidaysCount) - teamDaysOff.teamVacationDaysCount) * bsp) / totalLastSprintCapacity) * 10) / 10;
}

function countIterationHolidays(startDate, weeks, holidays, team) {
    const start = new Date(startDate);
    const endDate = addWeeks(weeks, start);
    let holidaysCount = 0;

    holidays.forEach(function (item) {
        let holidayDate = new Date(item.date);
        if (holidayDate >= start && holidayDate <= endDate) {
            holidaysCount++;
        }
    });

    return {
        publicHolidaysCount: holidaysCount,
        teamVacationDaysCount: getHolidaysForTeam(team, start, endDate)
    };
}

function addWeeks(weekNo, start, date = new Date()) {
    date.setDate(start.getDate() + weekNo * 7);
    return date;
}

// to be removed just here for testing
// calculate({
//     currentSprintStats: {
//         sprintStartDate: '2022-10-27',
//         noOfSprintWeeks: 3,
//         noOfDevs: 5
//     },
//     previousSprintStats: {
//         numberOfPeople: 5,
//         storyPoints: 15,
//         capacity: 60
//     },
//     team: "Groot"
// }).then((result) => {
//     console.log(result);
// });

module.exports = calculate;