require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV, CLIENT_ORIGIN } = require('./config')
const errorHandler = require('./errorHandler')
const validateBearerToken = require('./validateBearerToken')
const usersRouter = require('./users/users-router')
const groupsRouter = require('./groups/groups-router')
const productsRouter = require('./products/products-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(
  cors({
      origin: CLIENT_ORIGIN
  })
);

app.use('/api/users', usersRouter)

app.use(validateBearerToken)

app.use('/api/groups', groupsRouter)
app.use('/api/products', productsRouter)

app.use(errorHandler)

module.exports = app