/* eslint-disable no-undef */
const router = require('express').Router()

const { User } = require('../models')


const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    } else if (error.name === 'TypeError') {
        return res.status(400).json({ error: error.message })
    } else if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: error.message })
    } else {
        res.status(500).send(`Something went wrong!`)
    }
    next(error)
}

router.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    next(error)
  }
})

router.get('/:id', async (req, res) => {
    
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', async (req, res, next) => {
   
    try {
        const user = await User.findOne({where: { username: req.params.username }})
        user.name = req.body.name
        await user.save()
        res.json(user)
    } catch (error) {
        next(error)
    }
})

router.use(errorHandler)

module.exports = router