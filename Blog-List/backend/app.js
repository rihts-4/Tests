const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const usersRouter = require('./controllers/users')
const blogsRouter = require('./controllers/blogs')
const loginRouter = require('./controllers/login')
const testRouter = require('./controllers/test')

mongoose.set('strictQuery', false)

logger.info('connecting to MongoDB')
mongoose
    .connect(config.MONGODB_URI)
    .then(() => {logger.info('connected to MongoDB')})
    .catch(error => {logger.error(error.message)})

app.use(cors())
app.use(express.json())

app.use(middleware.tokenExtractor)

if (process.env.NODE_ENV === 'test') {
    app.use('/api/test', testRouter)
}

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

app.use(middleware.errorHandler)

module.exports = app