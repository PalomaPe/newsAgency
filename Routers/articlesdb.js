const express = require('express');

const articlesdb = express.Router();
const mValidation = require('../modules/mValidation');
// const mongoClient = require("../helpers/mongoClient"); // FIX: require en appdb.js, hacer global a la db
const { aSchemaPost, aSchemaPatch } = require('../modules/schemaValidation');
const auth = require('../modules/auth');
const getAllArticlesDB = require('../controllers/getAllArticlesDB');
const getArticleByIdDB = require('../controllers/getArticleByIdDB');
const postArticleDB = require('../controllers/postArticle');
const patchArticleDB = require('../controllers/patchArticleDB');
const putArticleDB = require('../controllers/putArticleDB');
const deleteArticleDB = require('../controllers/deleteArticleDB');

articlesdb.get('/', getAllArticlesDB);

articlesdb.get('/:id', getArticleByIdDB);

articlesdb.post('/', auth, mValidation(aSchemaPost), postArticleDB);

articlesdb.patch('/:id', auth, mValidation(aSchemaPatch), patchArticleDB);

articlesdb.put('/:id', auth, mValidation(aSchemaPatch), putArticleDB);

articlesdb.delete('/:id', auth, deleteArticleDB);

module.exports = Object.freeze(articlesdb);
