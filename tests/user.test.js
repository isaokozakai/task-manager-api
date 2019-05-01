const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
  const response = await request(app).post('/users').send({
    name: 'Isao',
    email: 'isao@ii.oo',
    password: 'myPass999'
  }).expect(201)

  // Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  // Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: 'Isao',
      email: 'isao@ii.oo'
    },
    token: user.tokens[0].token
  })
  expect(user.password).not.toBe('myPass999')
})

test('Should not signup user with invalid name', async () => {
  await request(app).post('/users').send({
      name: '',
      email: 'isao@test.jp',
      password: 'MYPPPaaa000'
    }).expect(400)
})

test('Should not signup user with invalid email', async () => {
  await request(app).post('/users').send({
      name: 'Isao',
      email: 'isaoio.io',
      password: 'MYPPPaaa000'
    }).expect(400)
})

test('Should not signup user with invalid password', async () => {
  await request(app).post('/users').send({
      name: 'Isao',
      email: 'isao4@io.io',
      password: 'MYP000'
    }).expect(400)
})

test('Should login existing user', async () => {
  const response = await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  }).expect(200)
  const user = await User.findById(userOneId)
  expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexistent user', async () => {
  await request(app).post('/users/login').send({
    email: userOne.email,
    password: '56what!!'
  }).expect(400)
})

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)    
  const user = await User.findById(userOneId)
  expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200)
  const user = await User.findById(userOneId)
  expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .send({
      name: 'Mikie'
    })
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(200)
  const user = await User.findById(userOneId)
  expect(user.name).toEqual('Mikie')
})

test('Should not update user if unauthenticated', async () => {
  await request(app)
    .patch('/users/me')
    .send({
      name: 'Mikie'
    })
    .expect(401)
})

test('Should not update user with invalid name', async () => {
  await request(app)
    .patch('/users/me')
    .send({
      name: ''
    })
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(400)
})

test('Should not update user with invalid email', async () => {
  await request(app)
    .patch('/users/me')
    .send({
      email: 'testemail'
    })
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(400)
})

test('Should not update user with invalid password', async () => {
  await request(app)
    .patch('/users/me')
    .send({
      email: 'PasSwoRd2233'
    })
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(400)
})

test('Should not update invalid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .send({
      location: 'Philadelphia'
    })
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .expect(400)
})