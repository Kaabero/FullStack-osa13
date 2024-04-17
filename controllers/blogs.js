/* eslint-disable no-undef */
const router = require('express').Router()

const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    } else if (error.name === 'TypeError') {
        return res.status(400).json({ error: error.message })
    } else if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: 'ValidationError' })
    } else {
        res.status(500).send(`Something went wrong!`)
    }
    next(error)
}


router.get('/', async (req, res) => {
    const blogs = await Blog.findAll()
    res.json(blogs)
})
  
router.post('/', async (req, res, next) => {
    console.log(req.body)
    try {
      const blog = await Blog.create(req.body)
      console.log(blog.toJSON())
      return res.json(blog)
    } catch(error) {
      next(error)
    }
})
  
router.get('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
      res.json(req.blog)
    } else {
      res.status(404).end()
    }
})
  
  
router.delete('/:id', blogFinder, async (req, res) => {
  
    if (req.blog) {
      await req.blog.destroy()
      res.status(204).end()
    } else {
      res.status(404).end()
    }
})

router.put('/:id', blogFinder, async (req, res, next) => {
    try {
        req.blog.likes = req.body.likes
        await req.blog.save()
        res.json(req.blog)
    } catch (error) {
        next(error)
    }
})

router.use(errorHandler)

module.exports = router