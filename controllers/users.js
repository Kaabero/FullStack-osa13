/* eslint-disable no-undef */
const router = require('express').Router()

const { User, ReadingList } = require('../models')
const { Blog } = require('../models')



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
  const users = await User.findAll({
    include: {
        model: Blog,
        attributes: { exclude: ['userId']}
    }
  })
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

  let where = {}

  if (req.query) {
    where = req.query
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['created_at', 'updated_at'] } ,
    include: [
      {
        model: Blog,
        attributes: { exclude: ['userId', 'created_at', 'updated_at'] },
      },
      {
        model: Blog, 
        where,
        as: 'readings',
        attributes: { exclude: ['userId', 'created_at', 'updated_at']},
        include: {
            model: ReadingList, 
            attributes: { exclude: [ 'userId', 'blogId' ] }
          },
        through: {
          attributes: []
        },
      },
      
    ]
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id)
    if (user) {
      await user.destroy()
      res.status(204).end()
    } else {
      res.status(404).end()
    }
})

router.use(errorHandler)

module.exports = router