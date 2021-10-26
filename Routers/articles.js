const express = require('express');
// REVIEW:
// Utiliza variables descriptivas.
// FIX:
const getAllArticles = require('../controllers/getAllArticles.js');
const postArticle = require('../controllers/postArticle.js');
const getArticleById = require('../controllers/getArticleById');

const articles = express.Router();

/**
 * REVIEW:
 *  Como buena prática, no implementamos la lógica junto con el Router.
 *  Sino que tenemos lo que son los controladores, y entonces las rutas
 *  son para vincular el enpoint a esos controladores.
 *
 *  const getAllArticles = require('../controllers/getAllArticles');
 *  articles.get("/", getAllArticles);
 *
 *  Luego, en otro archivo (controllers/getAllArticles.js)
 *
 *   export const getAllArticles = (req, res) => {
 *     ...
 *   }
 */

// FIX:
articles.get('/', getAllArticles);

articles.get('/:id', getArticleById);

articles.post('/', postArticle);

module.exports = Object.freeze(articles);
