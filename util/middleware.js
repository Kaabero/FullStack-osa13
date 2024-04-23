/* eslint-disable no-undef */
const jwt = require('jsonwebtoken')
const { SECRET } = require('./config.js')
const Session = require('../models/session')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      let token
      try {
        token = await Session.findOne( { where: {token: authorization.substring(7)}})
      } catch (error) {
        return res.status(401).json({ error: 'token invalid' })
      }
      if (token) {
        try {
        req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
      
        } catch {
          return res.status(401).json({ error: 'token invalid' })
        }
      }
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
    } else {
      return res.status(401).json({ error: 'token missing' })
    }
      
  next()
}

module.exports = { tokenExtractor }