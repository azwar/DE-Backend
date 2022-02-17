const server = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

describe('User API Tests: create, update, delete', () => {
    it('POST /users/ Create User, will returns: 200 - success message', async () => {
        const inputUserData = {
            email: "user1@example.com",
            firstname: "user1",
            lastname: "lastname1",
            date_of_birth: "1986-01-01",
            location_lat: 1.3543850065423404,
            location_lng: 103.86524151967163
        }

        const res = await chai.request(server).post('/user').send(inputUserData)

        chai.expect(res.status).to.equal(200)
        chai.expect(res.body.message).equal(`User created with email: ${inputUserData.email}`)
    })

    it('POST /users/ Create Existing User, will returns: 400 - User already exists', async () => {
        const inputUserData = {
            email: "user1@example.com",
            firstname: "user1",
            lastname: "lastname1",
            date_of_birth: "1986-01-01",
            location_lat: 1.3543850065423404,
            location_lng: 103.86524151967163
        }

        const res = await chai.request(server).post('/user').send(inputUserData)

        chai.expect(res.status).to.equal(400)
        chai.expect(res.body.error).equal(`User already exists`)
    })

    it('PUT /users/ Update User, will returns: 200 - success message', async () => {
        const inputUserData = {
            email: "user1@example.com",
            firstname: "user-xyz",
            lastname: "lastname-xyz",
            date_of_birth: "1986-01-01",
            location_lat: 1.3543850065423404,
            location_lng: 103.86524151967163
        }

        const res = await chai.request(server).put('/user').send(inputUserData)

        chai.expect(res.status).to.equal(200)
        chai.expect(res.body.message).equal(`User updated with email: ${inputUserData.email}`)
    })

    it('DELETE /users/ Remove User, will returns success message', async () => {
        const inputUserData = {
            email: "user1@example.com"
        }

        const res = await chai.request(server).delete('/user').send(inputUserData)

        chai.expect(res.status).to.equal(200)
        chai.expect(res.body.message).to.equal(`User with email: ${inputUserData.email} deleted`)
    })

    it('DELETE /users/ Remove Not Existing User, will returns: 400 - failed message', async () => {
        const inputUserData = {
            email: "user1@example.com"
        }

        const res = await chai.request(server).delete('/user').send(inputUserData)

        chai.expect(res.status).to.equal(400)
        chai.expect(res.body.error).to.equal(`Failed to delete, user not exists`)
    })
})