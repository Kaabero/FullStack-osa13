/* eslint-disable no-undef */
const router = require('express').Router()

const { ReadingList } = require('../models')


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
  const readinglist = await ReadingList.findAll()
  res.json(readinglist)
})

router.post('/', async (req, res, next) => {
  try {
    const blog = await ReadingList.create(req.body)
    res.json(blog)
  } catch(error) {
    next(error)
  }
})


router.use(errorHandler)

module.exports = router