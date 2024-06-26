/* eslint-disable no-undef */
const express = require('express')
const app = express()

const { PORT } = require('./util/config.js')
const { connectToDatabase } = require('./util/db.js')

const blogsRouter = require('./controllers/blogs.js')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const readingListRouter = require('./controllers/readinglists')
const sessionRouter = require('./controllers/logout');

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readingListRouter)
app.use('/api/logout', sessionRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()