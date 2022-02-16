const Queue = require('bull');
const { find } = require('geo-tz');
const { timeUntil } = require('../helpers/date_helpers');
const { sendGreeting } = require('../services/greetings');
const { redisClient } = require('../helpers/redis_helper');

const sendGreetingQueue = new Queue('sendGreeting', {
  redis: {
    host: '127.0.0.1',
    port: 6379,
    password: ''
  }
});

const jobProcess = (job, done) => {
  const { message, email } = job.data;

  sendGreeting(message);
  done(null, 'success')
}

const creteGreatingSchedule = async (data) => {
  const { email, date_of_birth, lat, lng, message } = data;
  const userTimeZone = find(lat, lng);
  const timeToNotify = timeUntil(date_of_birth, userTimeZone[0])

  console.log('Time to notify: ', timeToNotify)

  const option = {
    delay: timeToNotify,
    attempts: 5
  }

  const jobData = {
    email: email,
    message: message
  }
  
  const job = await sendGreetingQueue.add(jobData, option)
  redisClient.set(email, job.id)
}

const removeQueue = (jobId) => {
  sendGreetingQueue.removeJobs(jobId)
}

sendGreetingQueue.process(jobProcess);

sendGreetingQueue.on('completed', job => {
  console.log(`Job with id ${job.id} has been completed`);
})

sendGreetingQueue.on('error', error => {
  console.log('Bull/1364 error: ' + error.message + '\n' + error.stack);
})

sendGreetingQueue.on('stalled', job => {
  console.info(`Job in ${job.queue.name} stalled for: ${job.id}`)
})

module.exports = {
  sendGreetingQueue, 
  creteGreatingSchedule,
  removeQueue
}