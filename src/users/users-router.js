const express = require('express')
const UsersService = require('./users-service')
const GroupsService = require('../groups/groups-service')

const usersRouter = express.Router()
const jsonParser = express.json()

const serializeUser = user => ({
  id: user.id,
  first_name: user.first_name,
  last_name: user.last_name,
})

usersRouter
  .route('/')

  .get((req, res, next) => {
    UsersService.getUsersByGroupId(req.app.get('db'), req.query.group_id || 0)
      .then(users => {
        res.json(users.map(serializeUser))
      })
      .catch(next)
  })

  usersRouter
  .route('/:user_id')

  .get((req, res, next) => {
    UsersService.getById(req.app.get('db'), req.params.user_id)
      .then(user => {
        if (!user) {
          return res.status(404).json({
            error: { message: `User doesn't exist` }
          })
        }
        return res.json(serializeUser(user))
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    if (req.user.id === req.query.user_id) {
      return res.status(400).json({
        error: {
          message: `Unauthorized request.`,
        }
      })
    }

    if (req.body.code) {
      GroupsService.getByCode(
        req.app.get('db'),
        req.body.code
      )
        .then((group) => {
          if(!group) {
            return res.status(400).json({
              error: {
                message: `Invalid Group Code.`,
              }
            })
          }

          UsersService.updateUserGroupId(
            req.app.get('db'),
            req.user.id,
            group.id
          )
            .then(() => {
              UsersService.getById(req.app.get('db'), req.user.id).then(updatedUser => {
                delete updatedUser.password
                res.status(201).json(updatedUser)
              })
            })
            .catch(next)
        })
        .catch(next)
    } else {
      UsersService.updateUserGroupId(
        req.app.get('db'),
        req.user.id,
        req.body.group_id
      )
        .then(() => {
          UsersService.getById(req.app.get('db'), req.user.id).then(updatedUser => {
            delete updatedUser.password
            res.status(201).json(updatedUser)
          })
        })
        .catch(next)
    }
  })

module.exports = usersRouter