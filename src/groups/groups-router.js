const express = require('express')
const path = require('path')
const GroupsService = require('./groups-service')

const groupsRouter = express.Router()
const jsonParser = express.json()

const serializeGroup = group => ({
  id: group.id,
  name: group.name,
  code: group.code,
})

groupsRouter
  .route('/')

  .get((req, res, next) => {
    GroupsService.getAllGroups(req.app.get('db'))
      .then(groups => {
        res.json(groups.map(serializeGroup))
      })
      .catch(next)
  })

  .post(jsonParser, (req, res, next) => {
    const { name, access_code } = req.body
    const newGroup = { name, access_code }

    for (const [key, value] of Object.entries(newGroup)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    GroupsService.insertGroup(req.app.get('db'), newGroup)
      .then(group => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${group.id}`))
          .json(serializeGroup(group))
      })
      .catch(next)
  })

  groupsRouter
  .route('/:group_id')

  .all((req, res, next) => {
    GroupsService.getById(req.app.get('db'), req.params.group_id)
      .then(group => {
        if (!group) {
          return res.status(404).json({
            error: { message: `Group doesn't exist` }
          })
        }
        res.group = group // save the group for the next middleware
        next() // call next so the next middleware happens
      })
      .catch(next)
  })

  .get((req, res, next) => {
    res.json(serializeGroup(res.group))
  })

  .delete((req, res, next) => {
    GroupsService.deleteGroup(req.app.get('db'), req.params.group_id)
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })

  .patch(jsonParser, (req, res, next) => {
    const { name, access_code } = req.body
    const groupToUpdate = { name, access_code }

    const numberOfValues = Object.values(groupToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain 'name' and 'code'`
        }
      })
    }

    GroupsService.updateGroup(
      req.app.get('db'),
      req.params.group_id,
      groupToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = groupsRouter
