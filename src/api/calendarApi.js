const calendarDb = require("../db/calendarDB.json");

const getHolidaysForTeam = (team, sprintStartDate, sprintEndDate) => {
  const teamHolidays = calendarDb.value.filter(
    (e) =>
      e.categories.includes(team) &&
      sprintStartDate.getTime() <= new Date(e.start.dateTime).getTime() &&
      new Date(e.end.dateTime).getTime() <= sprintEndDate.getTime()
  );

  let daysOfHolidays = 0;
  teamHolidays.forEach((holiday) => {
    const days =
      (new Date(holiday.end.dateTime).getTime() -
        new Date(holiday.start.dateTime).getTime()) /
      (1000 * 3600 * 24);
    return (daysOfHolidays += days);
  });
  console.log("Days Of Holidays", daysOfHolidays);
  return daysOfHolidays;
};

module.exports = getHolidaysForTeam;
