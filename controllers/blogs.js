/* eslint-disable no-undef */

const router = require('express').Router()
const { Op } = require('sequelize')
const { tokenExtractor } = require('../util/middleware')



const { Blog } = require('../models')
const { User } = require('../models')



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
        return res.status(400).json({ error: error.message })
    } else {
        res.status(500).send(`Something went wrong!`)
    }
    next(error)
}


router.get('/', async (req, res, next) => {
    try {
        let where = {}
        if (req.query.search) {
            where = {
                [Op.or]:
                [{
                    title: {
                        [Op.iLike]: `%${req.query.search}%`
                    }
                },
                {
                    author: {
                        [Op.iLike]: `%${req.query.search}%`
                    }
                }]
            }
        }
        const blogs = await Blog.findAll({
            attributes: { exclude: ['userId']},
            include: {
                model: User,
                attributes: ['name', 'username']
            },
            where,
            order: [
                ['likes', 'DESC']
            ]
        })
        res.json(blogs)

    } catch (error) {
        next(error)
    }
})
  
router.post('/', tokenExtractor, async (req, res, next) => {
    console.log(req.body)
    try {
        const user = await User.findByPk(req.decodedToken.id)
        if (user.disabled) {
            return response.status(401).json({
              error: 'account disabled, please contact admin'
            })
        }
        const blog = await Blog.create({ ...req.body, userId: user.id })
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
  
  
router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
    console.log('login_userId', req.decodedToken.id)
    const user = await User.findByPk(req.decodedToken.id)
    if (user.disabled) {
        return response.status(401).json({
            error: 'account disabled, please contact admin'
        })
    }
  
    if (req.blog) {
        console.log('blog_userId', req.blog.dataValues.userId)
        if (req.decodedToken.id === req.blog.dataValues.userId) {
            await req.blog.destroy()
            res.status(204).end()
        } else {
            return res.status(404).json({ error: 'invalid credentials' })
        }
    } else {
        return res.status(404).json({ error: 'invalid blog id number' })
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