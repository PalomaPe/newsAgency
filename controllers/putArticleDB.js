const { ObjectId } = require('mongodb');
const { Author } = require('../modules/author');

const putArticleDB = async (req, res) => {
  const idParam = req.params.id;
  const reqBody = req.body;
  /**
   * REVIEW:
   *  Todas estas variables se utilizan en el mismo if,
   *   - ¿Por qué no declararlas en la misma línea donde se asignan?
   */

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

  // FIX:
  try {
    await db
      .collection('articles')
      .updateOne(
        { _id: ObjectId(idParam) },
        {
          $set: reqBody,
        },
        {
          upsert: true,
        },
      )
      .then((result) => {
        if (result.matchedCount == 0) {
          Author.updateOne(
            { _id: req.body.author },
            { $addToSet: { articles: result.upsertedId._id } },
          ).then(() => res.status(200).json({
            message: `Document with id ${idParam} was successfully added`,
          }));
        } else {
          return res.status(200).json({
            message: `Document with id ${idParam} was successfully updated`,
          });
        }
      });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: `Does not exist document with id ${idParam} or could not be upserted`,
    });
  }

  // let docCountBefore = await db.collection("articles").countDocuments();
  // let docCountBefore = parseInt(docCountBefore, 10);
  // docCountAfter = await db.collection('articles').countDocuments();
  // docCountAfter = parseInt(docCountAfter, 10);
  /*
      if (docCountBefore < docCountAfter) {
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
    */
};

module.exports = Object.freeze(putArticleDB);
