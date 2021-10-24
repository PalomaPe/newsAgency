const express = require("express");

const authorsdb = express.Router();
const { ObjectId } = require("bson");
const {
  Author,
  authorSchemaPost,
  authorSchemaPatch,
} = require("../modules/author");
const mValidation = require("../modules/mValidation");
const mongoClient = require("../helpers/mongoClient");
const auth = require("../modules/auth");

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
          .json({ message: `There is no document with id ${idParam}` });
      }
      return res.status(200).json(results);
    })
    .catch((err) => {
      console.log(err);
    });
});

authorsdb.post("/", auth, mValidation(authorSchemaPost), async (req, res) => {
  /**
   * REVIEW: ¿Validación?.
   */
  // FIX
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

authorsdb.put(
  "/:id",
  auth,
  mValidation(authorSchemaPatch),
  async (req, res) => {
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
        /**
         * REVIEW:
         *  En este caso sería 201 Created.
         */
        // FIX:
        return res.status(201).json({
          message: `Document with id ${idParam} was successfully added`,
        });
      })
      .catch((error) => {
        /**
         * Review:
         * Acá solo entra si ocurrió un error con la consulta,
         * pero no si el author no apareción. Sobre todo porque tienes
         * un upsert, lo cual si no está lo insertará.
         *
         * Lo correcto es devolver error 500 (al menos) para indicar que,
         * el problema es del API, el servidor, y no del cliente.
         */
        console.error(error);
        // FIX:
        res
          .status(500)
          .send({ message: `Could not update document with id ${idParam}` });
      });
  }
);

authorsdb.patch(
  "/:id",
  auth,
  mValidation(authorSchemaPatch),
  async (req, res) => {
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
        /**
         * REVIEW:
         *  Si ocurre un error en la ejecución, la petición actual se queda colgada infinitamente,
         *  dado que no estás devolviendo nada utilizando res.status(5xx)... etc.
         *
         *  Siempre se debe enviar una respuesta, de lo contrario el cliente recibirá un timeout
         *  al cabo de X tiempo, pero la petición seguirá siendo procesada por el servidor,
         *  consumiento recursos.
         */
        console.error(err);
        // FIX:
        return res
          .status(500)
          .json({ message: `Could not update document with id ${idParam}` });
      });
  }
);

authorsdb.delete("/:id", auth, async (req, res) => {
  const idParam = req.params.id;
  /**
   * REVIEW:
   * Prefiere la ejecución en paralelo siempre que sea posible.

  // Validar que exista el autor.
  const author = await Author.findOne({ _id: idParam });
  if (!author) {
    return res.status(404).end();
  }

  // IDs para eliminar.
  let articlesToDelete = author.articles.map((id) => ObjectId(id));

  // Ejecución en paralela.
  // Dependiendo de la applicación, quizás se pueda utilzar Promise.allSettled()
  // Y aceptar ciertos márgenes de errores.
  // Por ejemplo, podemos aceptar que falle el borrado de artículos,
  //  siempre y cuando el autor se haya eliminado.
  //
  Promise.all([
    mongoClient.client
      .db(process.env.DB_NAME)
      .collection("articles")
      .deleteMany({
        _id: { $in: articlesToDelete },
      }),

      Author.deleteOne({ _id: idParam }),
  ]).then(() => {
    return res.status(204).end();
  });
  */

  const author = await Author.findOne({ _id: idParam });
  if (!author) {
    return res.status(404).end();
  }

  const articlesToDelete = author.articles.map((id) => ObjectId(id));

  Promise.all([
    db.collection("articles").deleteMany({
      _id: { $in: articlesToDelete },
    }),
    Author.deleteOne({ _id: idParam }),
  ]).then(() => res.status(204).end());
  /*
  Author.find({ _id: idParam })
    .then((result) => result[0].articles)
    .then((articlesIds) => {
      const objectsIds = articlesIds.map((id) => ObjectId(id));
      return db.collection("articles").deleteMany({
        _id: {
          $in: objectsIds,
        },
      });
    })
    .then(() => Author.deleteOne({ _id: idParam }))
    .then(() => res.status(204).end())
    .catch((err) => { */
  /**
   * REVIEW:
   * Acá solo entra si hay un error en la ejecución de la consulta.
   * Lo correcto es devolver 500.
   * Si no existe o el resultado es vacío entra por el .then() ya que se ejecución bien.
   */
  // console.log(err);
  // FIX:
  //return res
  //  .status(500)
  //  .json({ message: `Could not find a document with id ${idParam}` });
  //});
});

module.exports = Object.freeze(authorsdb);
