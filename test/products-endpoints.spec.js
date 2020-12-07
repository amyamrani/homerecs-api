const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeProductsArray, seedProducts } = require('./products.fixtures')
const { makeUsersArray, seedUsers } = require('./users.fixtures')

describe('Products Endpoints', function() {
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

  describe('GET /api/products', () => {
    context('Given no products', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/api/products')
          .set('Authorization', `Bearer ${testUsers[0].token}`)
          .expect(200, [])
      })
    })

    context('Given there are products in the database', () => {
      const testProducts = makeProductsArray()

      beforeEach('insert products', () => {
        seedProducts(db, testProducts)
      })

      it('responds with 200 and returns all of the products for the given user_id', () => {
        const testUserProducts = testProducts.filter(testProduct => testProduct.user_id === 1);

        return supertest(app)
          .get('/api/products?user_id=1')
          .set('Authorization', `Bearer ${testUsers[0].token}`)
          .expect(200, testUserProducts)
      })
    })
  })

  describe('GET /api/products/:product_id', () => {
    context('Given no products', () => {
      it('responds with 404', () => {
        const productId = 123456
        return supertest(app)
          .get(`/api/products/${productId}`)
          .set('Authorization', `Bearer ${testUsers[0].token}`)
          .expect(404, { error: { message: `Product doesn't exist` } })
      })
    })

    context('Given there are products in the database', () => {
      const testProducts = makeProductsArray()

      beforeEach('insert products', () => {
        seedProducts(db, testProducts)
      })

      it('responds with 200 and the specified product', () => {
        const productId = 2
        const expectedProduct = testProducts[productId - 1]
        return supertest(app)
          .get(`/api/products/${productId}`)
          .set('Authorization', `Bearer ${testUsers[0].token}`)
          .expect(200, expectedProduct)
      })
    })
  })

  describe('PATCH /api/products/:product_id', () => {
    context('Given no products', () => {
      it(`responds with 404`, () => {
        const productId = 123456
        return supertest(app)
          .patch(`/api/products/${productId}`)
          .set('Authorization', `Bearer ${testUsers[0].token}`)
          .expect(404, { error: { message: `Product doesn't exist` } })
      })
    })

    context('Given there are products in the database', () => {
      const testUsers = makeUsersArray()
      const testProducts = makeProductsArray()

      beforeEach('insert products', () => {
        seedProducts(db, testProducts)
      })

      it('responds with 204 and updates the product', () => {
        const idToUpdate = testProducts[0].id
        const updateProduct = {
          name: 'updated product name',
        }
        const expectedProduct = {
          ...testProducts[idToUpdate - 1],
          ...updateProduct
        }
        return supertest(app)
          .patch(`/api/products/${idToUpdate}`)
          .set('Authorization', `Bearer ${testUsers[0].token}`)
          .send(updateProduct)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/products/${idToUpdate}`)
              .set('Authorization', `Bearer ${testUsers[0].token}`)
              .expect(expectedProduct)
          )
      })

      it('responds with 400 when no required fields supplied', () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/products/${idToUpdate}`)
          .set('Authorization', `Bearer ${testUsers[0].token}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain 'name', 'url', 'comments', 'category'`
            }
          })
      })

      it('responds with 204 when updating only a subset of fields', () => {
        const idToUpdate = 2
        const updateProduct = {
          name: 'updated product name',
        }
        const expectedProduct = {
          ...testProducts[idToUpdate - 1],
          ...updateProduct
        }

        return supertest(app)
          .patch(`/api/products/${idToUpdate}`)
          .set('Authorization', `Bearer ${testUsers[0].token}`)
          .send({
            ...updateProduct,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/products/${idToUpdate}`)
              .set('Authorization', `Bearer ${testUsers[0].token}`)
              .expect(expectedProduct)
          )
      })
    })
  })

  describe('DELETE /api/products/:product_id', () => {
    context('Given no products', () => {
      it('responds with 404', () => {
        const productId = 123456
        return supertest(app)
          .delete(`/api/products/${productId}`)
          .set('Authorization', `Bearer ${testUsers[0].token}`)
          .expect(404, { error: { message: `Product doesn't exist` } })
      })
    })

    context('Given there are products in the database', () => {
      const testUsers = makeUsersArray()
      const testProducts = makeProductsArray()

      beforeEach('insert products', () => {
        seedProducts(db, testProducts)
      })

      it('responds with 204 and removes the product', () => {
        const idToRemove = testProducts[0].id
        const userId = testProducts[0].user_id
        const expectedProducts = testProducts.filter(product => product.id !== idToRemove && product.user_id === userId)
        return supertest(app)
          .delete(`/api/products/${idToRemove}`)
          .set('Authorization', `Bearer ${testUsers[0].token}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get('/api/products?user_id=' + userId)
              .set('Authorization', `Bearer ${testUsers[0].token}`)
              .expect(expectedProducts)
          )
      })
    })
  })
})
