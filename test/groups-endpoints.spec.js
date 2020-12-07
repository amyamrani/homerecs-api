const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeGroupsArray, seedGroups } = require('./groups.fixtures')
const { makeUsersArray, seedUsers } = require('./users.fixtures')

describe('Groups Endpoints', function() {
  let db
  const testUsers = makeUsersArray();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db.raw('TRUNCATE groups, products, users RESTART IDENTITY CASCADE'))

  beforeEach('insert users', () => seedUsers(db, testUsers));

  afterEach('cleanup', () => db.raw('TRUNCATE groups, products, users RESTART IDENTITY CASCADE'))

  describe('GET /api/groups', () => {
    context('Given no groups', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/api/groups')
          .set('Authorization', `Bearer ${testUsers[0].token}`)
          .expect(200, [])
      })
    })

    context('Given there are groups in the database', () => {
      const testGroups = makeGroupsArray()

      beforeEach('insert groups', () => {
        seedGroups(db, testGroups)
      })

      it('responds with 200 and all of the groups', () => {
        return supertest(app)
          .get('/api/groups')
          .set('Authorization', `Bearer ${testUsers[0].token}`)
          .expect(200, testGroups)
      })
    })
  })

  describe('GET /api/groups/:group_id', () => {
    context('Given no groups', () => {
      it('responds with 404', () => {
        const groupId = 123456
        return supertest(app)
          .get(`/api/groups/${groupId}`)
          .set('Authorization', `Bearer ${testUsers[0].token}`)
          .expect(404, { error: { message: `Group doesn't exist` } })
      })
    })

    context('Given there are groups in the database', () => {
      const testGroups = makeGroupsArray()

      beforeEach('insert groups', () => {
        seedGroups(db, testGroups)
      })

      it('responds with 200 and the specified group', () => {
        const groupId = 2
        const expectedGroup = testGroups[groupId - 1]
        return supertest(app)
          .get(`/api/groups/${groupId}`)
          .set('Authorization', `Bearer ${testUsers[0].token}`)
          .expect(200, expectedGroup)
      })
    })
  })

  describe('DELETE /api/groups/:group_id', () => {
    context('Given no groups', () => {
      it('responds with 404', () => {
        const groupId = 123456
        return supertest(app)
          .delete(`/api/groups/${groupId}`)
          .set('Authorization', `Bearer ${testUsers[0].token}`)
          .expect(404, { error: { message: `Group doesn't exist` } })
      })
    })

    context('Given there are groups in the database', () => {
      const testUsers = makeUsersArray()
      const testGroups = makeGroupsArray()

      it('responds with 204 and removes the group', () => {
        seedGroups(db, testGroups)
        const idToRemove = testGroups[0].id
        const expectedGroups = testGroups.filter(group => group.id !== idToRemove)
        return supertest(app)
          .delete(`/api/groups/${idToRemove}`)
          .set('Authorization', `Bearer ${testUsers[0].token}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get('/api/groups')
              .set('Authorization', `Bearer ${testUsers[0].token}`)
              .expect(expectedGroups)
          )
      })
    })
  })

  describe('PATCH /api/groups/:group_id', () => {
    context('Given no groups', () => {
      it(`responds with 404`, () => {
        const groupId = 123456
        return supertest(app)
          .patch(`/api/groups/${groupId}`)
          .set('Authorization', `Bearer ${testUsers[0].token}`)
          .expect(404, { error: { message: `Group doesn't exist` } })
      })
    })

    context('Given there are groups in the database', () => {
      const testUsers = makeUsersArray()
      const testGroups = makeGroupsArray()

      beforeEach('insert groups', () => {
        seedGroups(db, testGroups)
      })

      it('responds with 204 and updates the group', () => {
        const idToUpdate = testGroups[0].id
        const updateGroup = {
          name: 'updated group name',
        }
        const expectedGroup = {
          ...testGroups[idToUpdate - 1],
          ...updateGroup
        }
        return supertest(app)
          .patch(`/api/groups/${idToUpdate}`)
          .set('Authorization', `Bearer ${testUsers[0].token}`)
          .send(updateGroup)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/groups/${idToUpdate}`)
              .set('Authorization', `Bearer ${testUsers[0].token}`)
              .expect(expectedGroup)
          )
      })

      it('responds with 400 when no required fields supplied', () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/groups/${idToUpdate}`)
          .set('Authorization', `Bearer ${testUsers[0].token}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain 'name' and 'code'`
            }
          })
      })

      it('responds with 204 when updating only a subset of fields', () => {
        const idToUpdate = 2
        const updateGroup = {
          name: 'updated group name',
        }
        const expectedGroup = {
          ...testGroups[idToUpdate - 1],
          ...updateGroup
        }

        return supertest(app)
          .patch(`/api/groups/${idToUpdate}`)
          .set('Authorization', `Bearer ${testUsers[0].token}`)
          .send({
            ...updateGroup,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/groups/${idToUpdate}`)
              .set('Authorization', `Bearer ${testUsers[0].token}`)
              .expect(expectedGroup)
          )
      })
    })
  })
})
