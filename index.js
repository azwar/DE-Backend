const express = require('express')
const { sendMailQueue } = require('./src/queues/greetings.ques')
const app = express()
const port = 3000
const user = require('./src/routes/user')

app.use(express.json())

app.use('/user', user)
app.get('/', (req, res) => {
  res.send('Welcome!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
