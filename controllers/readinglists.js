/* eslint-disable no-undef */
const router = require('express').Router()

const { ReadingList } = require('../models')
const { User } = require('../models')
const { tokenExtractor } = require('../util/middleware')


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

router.put('/:id', tokenExtractor, async (req, res, next) => {
  console.log(req.body)
  try {
      const user = await User.findByPk(req.decodedToken.id)
    
      if (user.disabled) {
          return response.status(401).json({
            error: 'account disabled, please contact admin'
          })
      }
      const readinglist = await ReadingList.findByPk(req.params.id)
      if (user.id !== readinglist.userId) {
        res.status(404).send({ error: 'invalid credentials' });
      }
      readinglist.read = req.body.read
      await readinglist.save()
 
      return res.json(readinglist)
  } catch(error) {
      next(error)
  }
})




router.use(errorHandler)

module.exports = router