const express = require("express");
const fs = require("fs");
const s = require("../modules/searchByIdDB");
const v = require("../modules/validation");
const p = require("../modules/post.js");
const articles = express.Router();

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
