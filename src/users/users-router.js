const express = require('express')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonParser = express.json()

usersRouter
  .route('/signup')

  .post(jsonParser, (req, res, next) => {
    const user = req.body

    for (const key of ['first_name', 'last_name', 'email', 'password']) {
      if (user[key] == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }
    UsersService.hashPassword(user.password)
      .then((hashedPassword) => {
        delete user.password
        user.password = hashedPassword
      })
      .then(() => UsersService.createToken())
      .then(token => user.token = token)
      .then(() => UsersService.createUser(req.app.get('db'), user))
      .then(user => {
        delete user.password
        res.status(201).json(user)
      })
      .catch((err) => {
        next()
      })
  })

usersRouter
  .route('/login')

  .post(jsonParser, (req, res, next) => {
    const userReq = req.body
    let user;

    for (const key of ['email', 'password']) {
      if (userReq[key] == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    UsersService.getByEmail(req.app.get('db'), userReq.email)
      .then(foundUser => {
        user = foundUser
        if (!foundUser) {
          throw new Error('User cannot be found.');
        }

        return UsersService.checkPassword(userReq.password, foundUser)
      })
      .then(res => {
        return UsersService.createToken()
      })
      .then(token => {
        UsersService.updateUserToken(req.app.get('db'), user.id, token)
        return token;
      })
      .then((token) => {
        const newUser = {...user, token: token};
        delete newUser.password
        res.status(200).json(newUser)
      })
      .catch((err) => {
        next()
      })
  })

module.exports = usersRouter