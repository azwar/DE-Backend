const { find } = require("geo-tz");
const { sendGreetingQueue } = require("../queues/greetings.ques");
const { timeUntil } = require("../helpers/date_helpers");

const sendGreeting = (message) => {
  console.log(`############### ${message} ###############`);
}

module.exports = {
  sendGreeting
}