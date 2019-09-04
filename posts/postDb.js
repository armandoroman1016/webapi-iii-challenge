const db = require('../data/dbConfig.js');

module.exports = {
  get,
  getPostById,
  insertPost,
  update,
  remove,
};

function get() {
  return db('posts');
}

function getPostById(id) {
  return db('posts')
    .where({ id })
    .first();
}

function insertPost(post) {
  return db('posts')
    .insert(post)
    .then(ids => {
      return getById(ids[0]);
    });
}

function update(id, changes) {
  return db('posts')
    .where({ id })
    .update(changes);
}

function remove(id) {
  return db('posts')
    .where('id', id)
    .del();
}
