const express = require("express");
const articlesdb = express.Router();
const { ObjectId } = require("mongodb");
const v = require("../modules/validation");
const middlewarePost = require("../modules/middlewarePost");
const middlewarePatch = require("../modules/middlewarePatch");
const mongoClient = require("../helpers/mongoClient");
const { aSchemaPost, aSchemaPatch } = require("../modules/schemaValidation");
const Author = require("../modules/author");
const auth = require("../modules/auth");

articlesdb.get("/", async (req, res) => {
  const articlesCol = await mongoClient.client
    .db(process.env.DB_NAME)
    .collection("articles")
    .find({})
    .toArray();
  res.status(200).json(articlesCol);
});

articlesdb.get("/:id", async (req, res) => {
  const idParam = req.params.id;
  try {
    const articlesCol = await mongoClient.client
      .db(process.env.DB_NAME)
      .collection("articles")
      .find({ _id: ObjectId(idParam) })
      .toArray();
    res.status(200).json(articlesCol);
  } catch (err) {
    console.log(err);
    res
      .status(404)
      .json({ message: `There is no document with id ${idParam}` });
  }
});

articlesdb.post("/", auth, middlewarePost(aSchemaPost), async (req, res) => {
  const articlePost = req.body;
  const errMessages = await v.articleValidation(articlePost, "from Postman");
  if (errMessages == "") {
    await mongoClient.client
      .db(process.env.DB_NAME)
      .collection("articles")
      .insertOne(articlePost);
    let idNew = await mongoClient.client
      .db(process.env.DB_NAME)
      .collection("articles")
      .find({}, { _id: 1 })
      .sort({ $natural: -1 })
      .limit(1)
      .toArray();
    idNew = idNew[0]._id;
    Author.updateOne(
      { _id: req.body.author },
      { $addToSet: { articles: idNew } }
    )
      .then(() => {
        res.status(201).json({ message: "Document posted in db" });
      })
      .catch((err) => console.log(err));
  } else {
    res.status(400).json({ messages: errMessages });
  }
});

articlesdb.patch(
  "/:id",
  auth,
  middlewarePatch(aSchemaPatch),
  async (req, res) => {
    const idParam = req.params.id;
    const reqBody = req.body;
    try {
      await mongoClient.client
        .db(process.env.DB_NAME)
        .collection("articles")
        .updateOne(
          { _id: ObjectId(idParam) },
          {
            $set: reqBody,
          }
        )
        .then((result) => {
          if (result.result.n) {
            return res
              .status(200)
              .json({ message: `Document with id ${idParam} was updated` });
          }
          return res
            .status(404)
            .json({ message: `Could not find document with id ${idParam}` });
        });
    } catch (err) {
      console.error(err);
    }
  }
);

articlesdb.put(
  "/:id",
  auth,
  middlewarePatch(aSchemaPatch),
  async (req, res) => {
    const idParam = req.params.id;
    const reqBody = req.body;
    let idNew;
    let docCountBefore;
    let docCountAfter;
    try {
      docCountBefore = await mongoClient.client
        .db(process.env.DB_NAME)
        .collection("articles")
        .countDocuments();
      docCountBefore = parseInt(docCountBefore);
      await mongoClient.client
        .db(process.env.DB_NAME)
        .collection("articles")
        .updateOne(
          { _id: ObjectId(idParam) },
          {
            $set: reqBody,
          },
          {
            upsert: true,
          }
        );
      docCountAfter = await mongoClient.client
        .db(process.env.DB_NAME)
        .collection("articles")
        .countDocuments();
      docCountAfter = parseInt(docCountAfter);
      if (docCountBefore < docCountAfter) {
        idNew = await mongoClient.client
          .db(process.env.DB_NAME)
          .collection("articles")
          .find({}, { _id: 1 })
          .sort({ $natural: -1 })
          .limit(1)
          .toArray();
        idNew = idNew[0]._id;
        Author.updateOne(
          { _id: req.body.author },
          { $addToSet: { articles: idNew } }
        )
          .then(() => {
            return res.status(200).json({
              message: `Document with id ${idParam} was successfully added`,
            });
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        return res.status(200).json({
          message: `Document with id ${idParam} was successfully updated`,
        });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(404)
        .json({ message: `The id ${idParam} is not valid` });
    }
  }
);

articlesdb.delete("/:id", auth, async (req, res) => {
  const idParam = req.params.id;
  try {
    let authorId = await mongoClient.client
      .db(process.env.DB_NAME)
      .collection("articles")
      .find({ _id: ObjectId(idParam) })
      .toArray();
    authorId = authorId[0].author;
    await mongoClient.client
      .db(process.env.DB_NAME)
      .collection("articles")
      .deleteOne({ _id: ObjectId(idParam) });
    Author.updateOne(
      { _id: authorId },
      {
        $pull: { articles: idParam },
      }
    ).then((result) => {
      return res.status(204).end();
    });
    //.catch((err) => {
    //  console.log(err);
    //});
  } catch (error) {
    console.error(error);
    return res
      .status(404)
      .json({ message: `There is no document with id ${idParam}` });
  }
});

module.exports = Object.freeze(articlesdb);
