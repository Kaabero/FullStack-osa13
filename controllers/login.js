/* eslint-disable no-undef */
const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')
const Session = require('../models/session');

router.post('/', async (request, response, next) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = body.password === 'salainen'

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  if (user.disabled) {
    return response.status(401).json({
      error: 'account disabled, please contact admin'
    })
  }

  const token = jwt.sign(userForToken, SECRET)

  try {
    await Session.create({token, user_id: user.id})
  } catch (error) {
    next(error)
  }

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router