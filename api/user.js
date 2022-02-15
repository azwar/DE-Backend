const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
  res.send('Birds home page')
})

router.delete('/', (req, res) => {
  res.send('About birds')
})

module.exports = router