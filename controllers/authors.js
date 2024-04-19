/* eslint-disable no-undef */
const router = require('express').Router()
const { sequelize } = require('../util/db');
const { Blog } = require('../models')


router.get('/', async (req, res) => {
    const blogs = await Blog.findAll({
      group: 'author',
      attributes: [
        'author',
        [sequelize.fn('count', sequelize.col('title')), 'blogs'],
        [sequelize.fn('sum', sequelize.col('likes')), 'likes']
        
      ],
      order: [
        ['likes', 'DESC']
    ]
    });
    res.json(blogs)
  })



module.exports = router