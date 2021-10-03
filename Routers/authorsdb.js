const express = require("express");
const authorsdb = express.Router();
const mongoose = require("mongoose");
const Author = require("../modules/author");
const mongoClient = require("../helpers/mongoClient");
const auth = require("../modules/auth");
const { ObjectID, ObjectId } = require("bson");

mongoose.Promise = global.Promise;

authorsdb.get("/", (req, res) => {
  Author.find()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Could not show documents" });
    });
});

authorsdb.get("/:id", async (req, res) => {
  const idParam = req.params.id;
  Author.findOne({ _id: idParam })
    .then((results) => {
      if (results == null) {
        return res
          .status(404)
          .json({ message: "There is no document with id " + idParam });
      }
      return res.status(200).json(results);
    })
    .catch((err) => {
      console.log(err);
    });
});

authorsdb.post("/", auth, async (req, res) => {
  const author = req.body;
  Author.create(author)
    .then(() => {
      res.status(200).json({ message: "Author posted in database" });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ message: "Could not post in database" });
    });
});

authorsdb.put("/:id", auth, async (req, res) => {
  const idParam = req.params.id;
  Author.updateOne({ _id: idParam }, req.body, {
    currentDate: { lastModified: true },
    upsert: true,
  })
    .then((results) => {
      if (results.nModified) {
        return res.status(200).json({
          message: `Document with id ${idParam} was updated`,
        });
      }
      return res.status(200).json({
        message: `Document with id ${idParam} was successfully added`,
      });
    })
    .catch((error) => {
      console.error(error);
      res
        .status(404)
        .send({ message: `Could not update document with id ${idParam}` });
    });
});

authorsdb.patch("/:id", auth, async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const idParam = req.params.id;
  Author.updateOne({ _id: idParam }, req.body)
    .then((result) => {
      if (result.n) {
        return res
          .status(200)
          .json({ message: `Document with id ${idParam} was updated` });
      }
      return res
        .status(404)
        .json({ message: `Could not found document with id ${idParam}` });
    })
    .catch((err) => {
      console.error(err);
    });
});

authorsdb.delete("/:id", auth, async (req, res) => {
  const idParam = req.params.id;
  Author.find({ _id: idParam })
    .then((result) => {
      return result[0].articles;
    })
    .then((articlesIds) => {
      let objectsIds = articlesIds.map((id) => ObjectId(id));
      return mongoClient.client
        .db(process.env.DB_NAME)
        .collection("articles")
        .deleteMany({
          _id: {
            $in: objectsIds,
          },
        });
    })
    .then(() => {
      return Author.deleteOne({ _id: idParam });
    })
    .then(() => {
      return res.status(204).end();
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(404)
        .json({ message: `Could not find a document with id ${idParam}` });
    });
});

module.exports = Object.freeze(authorsdb);
