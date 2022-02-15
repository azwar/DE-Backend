const { PrismaClient } = require('@prisma/client')
const express = require('express')
const router = express.Router()
const prisma = new PrismaClient()

router.post('/', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email
    }
  })

  if (user) {
    return res.status(400).send({ error: 'User already exists' })
  }

  const dob = new Date(req.body.date_of_birth)
  await prisma.user.create({
    data: {
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      date_of_birth: dob,
      location_lat: req.body.location_lat,
      location_lng: req.body.location_lng
    }
  }).catch(err => {
    console.log(err)
    return res.status(500).send(err)
  })

  res.send({
    message: `User created with email: ${req.body.email}`
  })
})

router.delete('/', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email
    }
  })

  if (!user) {
    return res.status(400).send({ error: 'Failed to delete, user not exists' })
  }

  await prisma.user.delete({
    where: {
      email: req.body.email
    }
  }).catch(err => {
    console.log(err)
    return res.status(500).send(err)
  })

  res.send({
    message: `User with email: ${req.body.email} deleted`
  })
})

router.put('/', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email
    }
  })

  if (!user) {
    return res.status(400).send({ error: 'Failed to update, user not exists' })
  }

  const dob = new Date(req.body.date_of_birth)
  await prisma.user.update({
    data: {
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      date_of_birth: dob,
      location_lat: req.body.location_lat,
      location_lng: req.body.location_lng
    },
    where: {
      email: req.body.email
    }
  }).catch(err => {
    console.log(err)
    return res.status(500).send(err)
  })

  res.send({
    message: `User updated with email: ${req.body.email}`
  })
})

module.exports = router