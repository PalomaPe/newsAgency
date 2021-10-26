const express = require('express');

const authorsdb = express.Router();
const { authorSchemaPost, authorSchemaPatch } = require('../modules/author');
const mValidation = require('../modules/mValidation');
const auth = require('../modules/auth');
const getAllAuthorsDB = require('../controllers/getAllAuthorsDB');
const getAuthorByIdDB = require('../controllers/getAuthorByIdDB');
const postAuthorDB = require('../controllers/postAuthorDB');
const putAuthorDB = require('../controllers/putArticleDB');
const patchAuthorDB = require('../controllers/patchAuthorDB');
const deleteAuthorDB = require('../controllers/deleteAuthorDB');

authorsdb.get('/', getAllAuthorsDB);

authorsdb.get('/:id', getAuthorByIdDB);

authorsdb.post('/', auth, mValidation(authorSchemaPost), postAuthorDB);

authorsdb.put('/:id', auth, mValidation(authorSchemaPatch), putAuthorDB);

authorsdb.patch('/:id', auth, mValidation(authorSchemaPatch), patchAuthorDB);

authorsdb.delete('/:id', auth, deleteAuthorDB);

module.exports = Object.freeze(authorsdb);
