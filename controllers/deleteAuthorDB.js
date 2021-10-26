const { ObjectId } = require('bson');
const { Author } = require('../modules/author');

const deleteAuthorDB = async (req, res) => {
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
    return res.status(404).end({ message: 'There are not articles in the db' });
  }

  const articlesToDelete = author.articles.map((id) => ObjectId(id));

  Promise.all([
    db.collection('articles').deleteMany({
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
  // return res
  //  .status(500)
  //  .json({ message: `Could not find a document with id ${idParam}` });
  // });
};

module.exports = Object.freeze(deleteAuthorDB);
