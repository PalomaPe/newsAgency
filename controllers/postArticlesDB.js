const validation = require('../modules/validation');
const { Author } = require('../modules/author');

const postArticlesDB = async (req, res) => {
  const articlePost = req.body;
  const errMessages = await validation.articleValidationReview(articlePost);
  if (errMessages == '') {
    const authorExists = await Author.exists({ _id: articlePost.author });
    if (authorExists) {
      const { insertedId } = await db
        .collection('articles')
        .insertOne(articlePost);
      Author.updateOne(
        { _id: articlePost.author },
        { $addToSet: { articles: insertedId } },
      )
        .then(() => res.status(201).json({ message: 'Document posted in db' }))
        .catch((err) => {
          console.log(err);
          return res.status(500).json({ message: 'Could not update author' });
        });
    } else {
      return res
        .status(400)
        .json({ message: `There is no author with id ${articlePost.author}` });
    }
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
    /*
      await db.collection("articles").insertOne(articlePost);
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
      */
  } else {
    return res.status(400).json({ messages: errMessages });
  }
};

module.exports = Object.freeze(postArticlesDB);
