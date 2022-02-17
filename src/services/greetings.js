const { default: axios } = require('axios')

const sendGreeting = async (message, done) => {
  const data = {
    message: message,
    sent_at: new Date().toString()
  }

  console.log('Greeting: Will send the message')

  axios.post('https://hookb.in/DrzNaeYgYPhPajxxa9xx', data).then(res => {
    if (res.status === 200) {
      console.log('Greeting: Message sent successfully')
      done(null, 'success')
    } else {
      done(null, 'not success')
    }
  }).catch(err => {
    console.error('Greeting: Error sending message')

    if (err.response) {
      console.log(err.response)
    }

    done(null, 'error')
  })
}

module.exports = {
  sendGreeting
}
