const { default: axios } = require("axios");

const sendGreeting = async (message, done) => {
  const data = {
    message: message,
    sent_at: new Date()
  }

  axios.post('https://hookb.in/DrzNaeYgYPhPajxxa9xx', data).then(res => {
    if (res.status === 200) {
      console.log('Message sent successfully');
      done(null, 'success')
    } else {
      done(null, 'not success')
    }
  }).catch(err => {
    console.error('Error sending message');
    console.log(err?.response);
    done(null, 'error')
  })
}

module.exports = {
  sendGreeting
}