const moment = require('moment-timezone');

const timeUntil = (date, strTimeZone) => {
  console.log(date)
  console.log(strTimeZone)

  const specialDay = moment.tz(date + ' 06:39 am', "YYYY-MM-DD h:mm a", strTimeZone)
  const specialDayUtc = specialDay.utc()
  const todayUtc = moment(new Date()).utc()
  const age = todayUtc.diff(specialDayUtc, 'years');
  let nextSpecialDay = moment(specialDay).add(age, 'years').utc();
  let secondsRemaining = todayUtc.diff(nextSpecialDay, 'second')

  if (secondsRemaining < 0) {
    nextSpecialDay.add(1, 'year')
  }

  return secondsRemaining;
}

module.exports = {
  timeUntil
}