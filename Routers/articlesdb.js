const express = require("express");

const articlesdb = express.Router();
const { ObjectId } = require("mongodb");
const v = require("../modules/validation");
const mValidation = require("../modules/mValidation");
// const mongoClient = require("../helpers/mongoClient");
const { aSchemaPost, aSchemaPatch } = require("../modules/schemaValidation");
const Author = require("../modules/author");
const auth = require("../modules/auth");
// const { db } = require("../modules/author");

articlesdb.get("/", async (req, res) => {
  console.log("entra");
  const articlesCol = await db.collection("articles").find({}).toArray();
  res.status(200).json(articlesCol);
});

articlesdb.get("/:id", async (req, res) => {
  const idParam = req.params.id;
  try {
    const articlesCol = await db
      .collection("articles")
      .find({ _id: ObjectId(idParam) })
      .toArray();

    // REVIEW:
    //  Acá es donde revisas si articlesCol no es nulo ni vacío
    //  y si es así devuelves 404.
    if (articlesCol == []) {
      res
        .status(404)
        .json({ message: `There is no document with id ${idParam}` });
    } else {
      res.status(200).json(articlesCol);
    }
  } catch (err) {
    /**
     * REVIEW:
     *  Si entra a este bloque, es porque ocurrio un error en tiempo de ejcución
     *  y no un error de que no se encontró el documento.
     *
     *  Si ese llegase a ser el caso, la consulta no da un error,
     *  pero si retorna un valor vació, po lo que nunca entra al catch.
     */
    console.log(err);
  }
});

articlesdb.post("/", auth, mValidation(aSchemaPost), async (req, res) => {
  const articlePost = req.body;
  const errMessages = await v.articleValidation(articlePost, "from Postman");
  if (errMessages == "") {
    await db.collection("articles").insertOne(articlePost);

    /**
     * REVIEW:
     *  Innecesario, la operación insertOne() anterior, ya devuelve el ID generado.
     *  Ver: https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne
     *
     *  const { insertedId } = await mongoClient.client
     *    .db(process.env.DB_NAME)
     *    .collection("articles")
     *    .insertOne(articlePost);
     *
     * Más detalles para analizar:
     *   - ¿Qué sucede si otro insertOne concurrente antes de obtener el último insertado?
     *     En entornos de alta concurrencia esto suele suceder.
     *     Por lo que no hay garantía que idNew es el mismo documento que guardaste con insertOne().
     */
    let idNew = await db
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

articlesdb.patch("/:id", auth, mValidation(aSchemaPatch), async (req, res) => {
  const idParam = req.params.id;
  /**
   * REVIEW:
   *  Esto es un poco más avanzado pero es un hueco de seguridad.
   *   - ¿Qué sucede si el req.body, al ser un JSON, contiene más campos de lo esperado?
   *   Por ejemplo, a parte de mandar los campos del article, podría incluir mil campos más del estilo
   *    {
   *      "title": "dfgfgfsgfg",
   *      ...
   *      "campo1": "value1",
   *      "campo2": "value2",
   *      ....
   *      "campo1000": "value1000",
   *   }
   *
   *   Como no se está validando por campos extra, el body completo termina en la base de datos,
   *   lo cual si mando muchas peticionones similares puedo desbordar la base de datos y
   *   pronto terminar sin espacio, haciendo swapping en disco y relentizando todo el sistema.
   */
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
});

articlesdb.put("/:id", auth, mValidation(aSchemaPatch), async (req, res) => {
  const idParam = req.params.id;
  const reqBody = req.body;
  /**
   * REVIEW:
   *  Todas estas variables se utilizan en el mismo if,
   *   - ¿Por qué no declararlas en la misma línea donde se asignan?
   */
  let idNew;
  let docCountBefore;
  let docCountAfter;
  try {
    /**
     * REVIEW:
     *   No necesitas contar los documentos antes,
     *   para luego ver si el upsert actualizó o insertó.
     *
     *   Ver: https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/
     *   Ya el insertOne te devuelve esa info.
     *   Por ejemplo, matchedCount te dice los documentos que coincidieron con el criterio
     *   y por ende fueron actualizados.
     *
     *   Si matchedCount es 0, entonces significa que no existía documento y por ende se insertó uno nuevo.
     */
    docCountBefore = await db.collection("articles").countDocuments();
    docCountBefore = parseInt(docCountBefore, 10);
    await db.collection("articles").updateOne(
      { _id: ObjectId(idParam) },
      {
        $set: reqBody,
      },
      {
        upsert: true,
      }
    );
    docCountAfter = await db.collection("articles").countDocuments();
    docCountAfter = parseInt(docCountAfter, 10);
    if (docCountBefore < docCountAfter) {
      idNew = await db
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
        .then(() =>
          res.status(200).json({
            message: `Document with id ${idParam} was successfully added`,
          })
        )
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
    return res.status(404).json({ message: `The id ${idParam} is not valid` });
  }
});

articlesdb.delete("/:id", auth, async (req, res) => {
  const idParam = req.params.id;
  try {
    let authorId = await db
      .collection("articles")
      .find({ _id: ObjectId(idParam) })
      .toArray();
    authorId = authorId[0].author;

    /**
     * REVIEW:
     *  Ambas operaciones se pueden hacer concurrentemente.
     *
     *  await Promise.all([
     *    mongoClient.client
     *      .db(process.env.DB_NAME)
     *      .collection("articles")
     *      .deleteOne({ _id: ObjectId(idParam) }),
     *
     *    Author.updateOne(
     *      { _id: authorId },
     *      { $pull: { articles: idParam } }
     *    )
     *  ]).then(() => {
     *    return res.status(204).end();
     *  });
     */
    await db.collection("articles").deleteOne({ _id: ObjectId(idParam) });
    Author.updateOne(
      { _id: authorId },
      {
        $pull: { articles: idParam },
      }
    ).then(() => res.status(204).end());
    // .catch((err) => {
    //  console.log(err);
    // });
  } catch (error) {
    console.error(error);
    return res
      .status(404)
      .json({ message: `There is no document with id ${idParam}` });
  }
});

module.exports = Object.freeze(articlesdb);
