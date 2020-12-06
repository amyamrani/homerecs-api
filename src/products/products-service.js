const ProductsService = {
  getAllProducts(knex) {
    return knex.select('*').from('products')
  },
  getAllProductsByUserId(knex, user_id) {
    return knex
      .select('*')
      .from('products')
      .where({ user_id })
  },
  insertProduct(knex, newProduct) {
    return knex
      .insert(newProduct)
      .into('products')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, id) {
    return knex.from('products').select('*').where('id', id).first()
  },
  deleteProduct(knex, id) {
    return knex('products')
      .where({ id })
      .delete()
  },
  updateProduct(knex, id, newProductFields) {
    return knex('products')
      .where({ id })
      .update(newProductFields)
  },
}

module.exports = ProductsService