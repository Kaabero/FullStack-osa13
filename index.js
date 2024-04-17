/* eslint-disable no-undef */
const express = require('express')
const app = express()

const { PORT } = require('./util/config.js')
const { connectToDatabase } = require('./util/db.js')

const blogsRouter = require('./controllers/blogs.js')

app.use(express.json())

app.use('/api/blogs', blogsRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()