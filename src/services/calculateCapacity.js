const getPublicHolidays = require("../api/publicHolidayApi");
const db = require("../db/historical.json");

const calculate = async (request) => {
  let bspSum = request.previousSprintStats.storyPoints ?? 0;
  let totalSprintCapacitySum = request.previousSprintStats.capacity ?? 0;
  let dbLength = db.length;

  if (
    request.previousSprintStats.storyPoints &&
    request.previousSprintStats.capacity
  ) {
    dbLength++;
  }

  const teamMembers = db[0].numberOfPeople; //historical number of people is the same
  const publicHoliday = await getPublicHolidays(new Date().getFullYear());
  const publicHolidayCount = countIterationHolidays(
    request.currentSprintStats.sprintStartDate,
    request.currentSprintStats.noOfSprintWeeks,
    publicHoliday
  );

  db.forEach(function (item) {
    bspSum += item.storyPoints;
    totalSprintCapacitySum += item.capacity;
  });

  const bsp = bspSum / dbLength;
  const totalLastSprintCapacity = totalSprintCapacitySum / dbLength;

  return (
    Math.round(
      (((teamMembers * (14 - publicHolidayCount) -
        request.currentSprintStats.vacationDays) *
        bsp) /
        totalLastSprintCapacity) *
        10
    ) / 10
  );
};

function countIterationHolidays(startDate, weeks, holidays) {
  const start = new Date(startDate);
  const endDate = addWeeks(weeks, start);
  let holidaysCount = 0;

  holidays.forEach(function (item) {
    let holidayDate = new Date(item.date);
    if (holidayDate >= start && holidayDate <= endDate) {
      holidaysCount++;
    }
  });

  return holidaysCount;
}

function addWeeks(weekNo, start, date = new Date()) {
  date.setDate(start.getDate() + weekNo * 7);
  return date;
}

// to be removed just here for testing
calculate({
  currentSprintStats: {
    vacationDays: 10,
    sprintStartDate: "2022-10-27",
    noOfSprintWeeks: 3,
  },
  previousSprintStats: {
    numberOfPeople: 5,
    storyPoints: 15,
    capacity: 60,
  },
}).then((result) => {
  console.log(result);
});
