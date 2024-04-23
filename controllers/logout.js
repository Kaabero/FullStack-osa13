/* eslint-disable no-undef */
const router = require('express').Router()
const Session = require('../models/session')
const { tokenExtractor } = require('../util/middleware')



router.delete('/', tokenExtractor, async (req, res, next) => {
  try {
    await Session.destroy({ where: { user_id: req.decodedToken.id }})
    res.status(200).json({ success: 'User logged out' })
  } catch (error) {
    next(error)
  }
})

module.exports = router