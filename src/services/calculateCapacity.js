const getPublicHolidays = require("../api/publicHolidayApi");
const db = require("../db/historical.json");

const calculate = async(request) => {
    let bspSum = 0;
    let totalSprintCapacitySum = 0;

    const teamMembers = db[0].numberOfPeople; //historical number of people is the same
    const publicHoliday = await getPublicHolidays(new Date().getFullYear());
    const publicHolidayCount = countIterationHolidays(request.sprintStartDate, request.noOfSprintWeeks, publicHoliday);

    db.forEach(function (item) {
        bspSum += item.storyPoints;
        totalSprintCapacitySum += item.capacity;
    });

    const bsp = bspSum/teamMembers;
    const totalLastSprintCapacity = totalSprintCapacitySum/teamMembers;

    const x = ((teamMembers * (14 - publicHolidayCount) - request.vacationDays)* bsp)/ totalLastSprintCapacity;

    console.log(x);
}

function countIterationHolidays(startDate, weeks, holidays){
    const start = new Date(startDate);
    const endDate = addWeeks(weeks, start);
    let holidaysCount = 0;

    holidays.forEach(function (item){
        let holidayDate = new Date(item.date);
        if(holidayDate>=start && holidayDate<=endDate){
            holidaysCount++;
        }
    });

    return holidaysCount;
}

function addWeeks(weekNo, start, date = new Date()){
    date.setDate(start.getDate() + weekNo * 7);
    return date;
}

// to be removed just here for testing
calculate({vacationDays: 10,sprintStartDate: '2022-10-27', noOfSprintWeeks: 3});