const express = require('express')
const path = require('path')
const ProductsService = require('./products-service')

const productsRouter = express.Router()
const jsonParser = express.json()

const serializeProduct = product => ({
  id: product.id,
  user_id: product.user_id,
  name: product.name,
  url: product.url,
  comments: product.comments,
  category: product.category,
  date_created: product.date_created,
})

productsRouter
  .route('/')

  .get((req, res, next) => {
    ProductsService.getAllProductsByUserId(req.app.get('db'), req.query.user_id || 0)
      .then(products => {
        res.json(products.map(serializeProduct))
      })
      .catch(next)
  })

  .post(jsonParser, (req, res, next) => {
    const { name, url, comments, category } = req.body
    const newProduct = {
      name,
      url,
      comments,
      category,
      user_id: req.user.id,
      date_created: new Date(),
    }

    for (const [key, value] of Object.entries(newProduct)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
      }
    }

    ProductsService.insertProduct(req.app.get('db'), newProduct)
      .then(product => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${product.id}`))
          .json(serializeProduct(product))
      })
      .catch(next)
  })

  productsRouter
  .route('/:product_id')

  .all((req, res, next) => {
    ProductsService.getById(req.app.get('db'), req.params.product_id)
      .then(product => {
        if (!product) {
          return res.status(404).json({
            error: { message: `Product doesn't exist` }
          })
        }
        res.product = product // save the product for the next middleware
        next() // call next so the next middleware happens
      })
      .catch(next)
  })

  .get((req, res, next) => {
    res.json(serializeProduct(res.product))
  })

  .delete((req, res, next) => {
    ProductsService.deleteProduct(req.app.get('db'), req.params.product_id)
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })

  .patch(jsonParser, (req, res, next) => {
    const { name, url, comments, category } = req.body
    const productToUpdate = { name, url, comments, category }

    const numberOfValues = Object.values(productToUpdate).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain 'name', 'url', 'comments', 'category'`
        }
      })
    }

    ProductsService.updateProduct(
      req.app.get('db'),
      req.params.product_id,
      productToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = productsRouter
