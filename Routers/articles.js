const express = require("express");
const fs = require("fs");
// REVIEW:
// Utiliza variables descriptivas.
const s = require("../modules/searchByIdDB");
const v = require("../modules/validation");
const p = require("../modules/post.js");
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
articles.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  fs.readFile("./db.json", { flag: "a+" }, (err, data) => {
    if (err) {
      console.log(err);
      res.send({ message: err });
    } else {
      let d = data.toString();
      if (d == "") {
        return res
          .status(404)
          .json({ message: "There are no documents in database" });
      }
      d = JSON.parse(data);
      // REVIEW:
      // Como indicaste que la codificación es JSON podrías hacer
      //
      //  res.status(200).json(d);
      //
      //  No solamente envía un json, sino que establece el header Content-Type como json,
      //  lo cual significa que la línea 9 no aplica.
      return res.status(200).send(JSON.stringify(d));
    }
  });
});

articles.get("/:id", async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    const articleId = await s.search(req.params.id);
    if (articleId == "")
      return res
        .status(404)
        .json({ message: "There is no document with id " + req.params.id });
    return res.status(200).send(articleId);
  } catch (err) {
    console.log(err);
  }
});

articles.post("/", async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");
    const article = req.body;
    // REVIEW:
    // Se valida sin importar el cliente, "from Postman" no aplica.
    let errMessages = await v.articleValidation(article, "from Postman");
    if (errMessages == "") {
      await p.appendToDB(article);
      res.status(201).send("Posted in db");
    } else {
      await p.appendToInvalids(article);
      res.status(400).send(errMessages);
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = Object.freeze(articles);
