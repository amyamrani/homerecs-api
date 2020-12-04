const GroupsService = {
  getAllGroups(knex) {
    return knex.select('*').from('groups')
  },
  insertGroup(knex, newGroup) {
    return knex
      .insert(newGroup)
      .into('groups')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
  getById(knex, id) {
    return knex.from('groups').select('*').where('id', id).first()
  },
  deleteGroup(knex, id) {
    return knex('groups')
      .where({ id })
      .delete()
  },
  updateGroup(knex, id, newGroupFields) {
    return knex('groups')
      .where({ id })
      .update(newGroupFields)
  },
}

module.exports = GroupsService