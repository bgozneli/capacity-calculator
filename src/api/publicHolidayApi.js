const axios = require("axios");

const getPublicHolidays = async (year) => {
  const { data } = await axios({
    method: "get",
    url: `https://date.nager.at/api/v3/publicholidays/${year}/DE`,
  });
  const bavarianPublicHolidays = data.filter(
    (holiday) => holiday.counties === null || holiday.counties.includes("DE-BY")
  );
  const bavarianPublicHolidaysOnWeekdays = bavarianPublicHolidays.filter(
    (holiday) => new Date(holiday.date).getDay() <= 5
  );
  return bavarianPublicHolidaysOnWeekdays;
};

module.exports = getPublicHolidays;

(async function () {
  const result = await getPublicHolidays(2022);
  console.log(result);
})();
