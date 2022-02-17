const { check, validationResult, body } = require('express-validator');
const express = require('express');
const { creteGreatingSchedule, removeQueue } = require('../queues/greetings.ques');
const { redisClient } = require('../helpers/redis_helper');
const { isUserExist, createUser, deleteUser, updateUser } = require('../services/user_services');
const router = express.Router()

const userValidation = [
  check('email').isEmail().withMessage('Please enter a valid email'),
  check('firstname').isLength({ min: 3, max: 60 }).withMessage('Firstname must be between 3 and 60 characters'),
  check('lastname').isLength({ min: 3, max: 60 }).withMessage('Lastname must be between 3 and 60 characters'),
  check('date_of_birth').isISO8601().withMessage('Please enter a valid date of birth yyyy-mm-dd'),
  check('location_lat').isDecimal().withMessage('Please enter a valid latitude with type decimal'),
  check('location_lng').isDecimal().withMessage('Please enter a valid longitude with type decimal'),
]

router.post('/', userValidation, async (req, res) => {
  const errors = validationResult(req);
  const { email, firstname, lastname, date_of_birth, location_lat, location_lng } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const userExist = await isUserExist(email)

  if (userExist) {
    return res.status(400).send({ error: 'User already exists' })
  }

  try {
    await createUser(req.body)
  } catch (error) {
    return res.status(500).send(error)
  }

  const fullName = `${firstname} ${lastname}`
  const data = {
    email: email,
    date_of_birth: date_of_birth,
    message: `Hey, ${fullName} it’s your birthday`,
    lat: location_lat,
    lng: location_lng
  };

  creteGreatingSchedule(data)

  res.send({
    message: `User created with email: ${req.body.email}`
  })
})

router.delete('/', async (req, res) => {
  const userExist = await isUserExist(req.body.email)

  if (!userExist) {
    return res.status(400).send({ error: 'Failed to delete, user not exists' })
  }

  try {
    await deleteUser(req.body.email)
  } catch (error) {
    return res.status(500).send(error)
  }

  // remove notification if user deleted
  const jobId = redisClient.get(req.body.email)
  await removeQueue(jobId)

  res.send({
    message: `User with email: ${req.body.email} deleted`
  })
})

router.put('/', userValidation, async (req, res) => {
  const { email, firstname, lastname, date_of_birth, location_lat, location_lng } = req.body;
  const userExist = await isUserExist(email)

  if (!userExist) {
    return res.status(400).send({ error: 'Failed to update, user not exists' })
  }

  await updateUser(req.body)
  const fullName = `${firstname} ${lastname}`
  const data = {
    email: email,
    date_of_birth: date_of_birth,
    message: `Hey, ${fullName} it’s your birthday`,
    lat: location_lat,
    lng: location_lng
  };
  
  const jobId = redisClient.get(email)
  await removeQueue(jobId)
  creteGreatingSchedule(data)

  res.send({
    message: `User updated with email: ${req.body.email}`
  })
})

module.exports = router