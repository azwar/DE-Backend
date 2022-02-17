/* eslint-disable camelcase */
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const createUser = async (data) => {
  const { email, firstname, lastname, date_of_birth, location_lat, location_lng } = data

  const dob = new Date(date_of_birth)
  await prisma.user.create({
    data: {
      email: email,
      firstname: firstname,
      lastname: lastname,
      date_of_birth: dob,
      location_lat: location_lat,
      location_lng: location_lng
    }
  }).catch(err => {
    throw err
  })
}

const isUserExist = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email
    }
  })

  return !!user
}

const deleteUser = async (email) => {
  await prisma.user.delete({
    where: {
      email: email
    }
  }).catch(err => {
    console.log(err)
    throw err
  })
}

const updateUser = async (data) => {
  const { email, firstname, lastname, date_of_birth, location_lat, location_lng } = data

  const dob = new Date(date_of_birth)
  await prisma.user.update({
    data: {
      email: email,
      firstname: firstname,
      lastname: lastname,
      date_of_birth: dob,
      location_lat: location_lat,
      location_lng: location_lng
    },
    where: {
      email: email
    }
  }).catch(err => {
    console.log(err)
    throw err
  })
}

module.exports = {
  createUser,
  isUserExist,
  deleteUser,
  updateUser
}
