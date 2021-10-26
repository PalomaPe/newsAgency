const { ObjectId } = require('mongodb');

const patchArticleDB = async (req, res) => {
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
    await db
      .collection('articles')
      .updateOne(
        { _id: ObjectId(idParam) },
        {
          $set: reqBody,
        },
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
};

module.exports = Object.freeze(patchArticleDB);
