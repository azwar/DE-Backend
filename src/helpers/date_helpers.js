const moment = require('moment-timezone');
const FORMAT_AM_PM = "YYYY-MM-DD hh:mm a";
const FORMAT_STD = "YYYY-MM-DD hh:mm";

const timeUntil = (date, strTimeZone) => {
  const specialDayTz = moment.tz(date + ' 12:22 am', FORMAT_AM_PM, strTimeZone)
  const todayUtc = moment().utc()
  const strTodayUtc = todayUtc.format(FORMAT_STD)
  const strSpecialDayTz = specialDayTz.format(FORMAT_STD)
  const todayTz = moment.utc(strTodayUtc).tz(strTimeZone)
  const strTodayUserTz = todayTz.format(FORMAT_STD)
  const age = todayTz.diff(specialDayTz, 'years');
  let nextSpecialDayTz = moment(strSpecialDayTz, FORMAT_STD, strTimeZone).add(age, 'years')

  const todayJsDate = moment(strTodayUserTz).toDate()
  const nextSpecialDayJsDate = nextSpecialDayTz.toDate()
  let minutesRemaining = moment(nextSpecialDayJsDate).diff(moment(todayJsDate), 'minutes');

  if (minutesRemaining < 0) {
    const nextTz2 = moment(nextSpecialDayJsDate).add(1, 'year')
    const nextDt = nextTz2.toDate()
    minutesRemaining = moment(nextDt).diff(moment(todayJsDate), 'minutes');
  }

  return minutesRemaining * 60;
}

module.exports = {
  timeUntil
}