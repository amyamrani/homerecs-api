function makeGroupsArray() {
  return [
    {
      id: 1,
      name: 'Best Buddies',
      code: 'code123',
    },
    {
      id: 2,
      name: 'Cousin Crew',
      code: 'code456',
    },
  ];
}

function seedGroups(db, groups) {
  return db
    .into('groups')
    .insert(groups)
    .then(() => {
      return db.raw(`SELECT setval('groups_id_seq',?)`, [
        groups[groups.length - 1].id,
      ]);
    });
}

module.exports = {
  makeGroupsArray,
  seedGroups
}