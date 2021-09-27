const express = require("express");

const articlesdb = express.Router();
const { ObjectId } = require("mongodb");
const v = require("../modules/validation");
const middlewarePost = require("../modules/middlewarePost");
const mongoClient = require("../helpers/mongoClient");
const { aSchemaPost } = require("../modules/schemaValidation");

articlesdb.get("/", async (req, res) => {
  try {
    const articlesCol = await mongoClient.client
      .db(process.env.DB_NAME)
      .collection("articles")
      .find({})
      .toArray();
    res.status(200).json(articlesCol);
  } catch (error) {
    console.log(error);
  }
});

articlesdb.get("/:id", async (req, res) => {
  try {
    const idParam = req.params.id;
    const articlesCol = await mongoClient.client
      .db(process.env.DB_NAME)
      .collection("articles")
      .find({ _id: ObjectId(idParam) })
      .toArray();
    res.status(200).json(articlesCol);
  } catch (err) {
    res
      .status(404)
      .json({ message: `There is no document with id ${idParam}` });
  }
});

articlesdb.post("/", middlewarePost(aSchemaPost), async (req, res) => {
  const articlePost = req.body;
  const errMessages = await v.articleValidation(articlePost, "from Postman");
  if (errMessages == "") {
    await mongoClient.client
      .db(process.env.DB_NAME)
      .collection("articles")
      .insertOne(articlePost)
      .then(() => {
        res.status(201).json({ message: "Posted in db" });
      })
      .catch((err) => console.log(err));
  } else {
    res.status(400).json({ message: errMessages });
  }
});

module.exports = articlesdb;
