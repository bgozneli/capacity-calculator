const axios = require("axios");

const teamToBoardIdMapping = {
  Batman: 536,
  Joker: 537,
  Thor: 529,
  Loki: 533,
  CaptainMarvel: 535,
  Groot: 534,
};

const getSprintId = async (boardId) => {
  const { data } = await axios({
    method: "get",
    url: `https://jira.jsmd-group.com/rest/agile/1.0/board/${boardId}/sprint?state=active`,
    headers: {
      Authorization: `Bearer ${process.env.JIRA_AUTH_TOKEN}`,
    },
  });
  return data.values[0].id;
};

const getBurntDownSprintInformationForTeam = async (team) => {
  const boardId = teamToBoardIdMapping[team];
  const sprintId = await getSprintId(boardId);
  const { data } = await axios({
    method: "get",
    url: `https://jira.jsmd-group.com/rest/agile/1.0/board/${boardId}/sprint/${sprintId}/issue?maxResults=200&jql=status=done`,
    headers: {
      Authorization: `Bearer ${process.env.JIRA_AUTH_TOKEN}`,
    },
  });
  let totalBurntStoryPoints = 0;
  console.log(data);
  data.issues.forEach((issue) => {
    if (issue.fields.customfield_10002) {
      console.log(totalBurntStoryPoints);
      totalBurntStoryPoints =
        totalBurntStoryPoints + issue.fields.customfield_10002;
    }
  });
  return totalBurntStoryPoints;
};

module.exports = getBurntDownSprintInformationForTeam;

// (async function () {
//   const result = await getBurntDownSprintInformationForTeam("Groot", 2176);
//   console.log(result);
// })();
