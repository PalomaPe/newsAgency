const express = require('express');
const fs = require('fs');
// REVIEW:
// Utiliza variables descriptivas.
// FIX:
const search = require('../modules/searchByIdDB');
const validation = require('../modules/validation');
const post = require('../modules/post');

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

articles.get('/', (req, res) => {
  fs.readFile('./db.json', { flag: 'a+' }, (err, data) => {
    if (err) {
      console.log(err);
      res.json({ message: err });
    } else {
      let d = data.toString();
      if (d == '') {
        return res
          .status(404)
          .json({ message: 'There are no documents in database' });
      }
      // d = JSON.parse(data);
      // REVIEW:
      // Como indicaste que la codificación es JSON podrías hacer
      //
      //  res.status(200).json(d);
      //
      //  No solamente envía un json, sino que establece el header Content-Type como json,
      //  lo cual significa que la línea 9 no aplica.
      d = JSON.parse(data);
      return res.status(200).json(d);
    }
  });
});

articles.get('/:id', async (req, res) => {
  try {
    const articleId = await search.search(req.params.id);
    if (articleId == '') {
      return res
        .status(404)
        .json({ message: `There is no document with id ${req.params.id}` });
    }
    return res.status(200).json(articleId);
  } catch (err) {
    console.log(err);
  }
});

articles.post('/', async (req, res) => {
  try {
    const article = req.body;
    // REVIEW:
    // Se valida sin importar el cliente, "from Postman" no aplica.
    const errMessages = await validation.articleValidationReview(article);
    if (errMessages == '') {
      await post.appendToDB(article);
      res.status(201).json({ message: 'Posted in db' });
    } else {
      res.status(400).json({ message: errMessages });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = Object.freeze(articles);
