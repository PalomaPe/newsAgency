const { ObjectId } = require('mongodb');
const { Author } = require('../modules/author');

const deleteArticleDB = async (req, res) => {
  const idParam = req.params.id;
  try {
    let authorId = await db
      .collection('articles')
      .find({ _id: ObjectId(idParam) })
      .toArray();
    authorId = authorId[0].author;
    // FIX: operaciones concurrentes
    if (authorId == '') {
      return res
        .status(404)
        .json({ message: `There is no document with id ${idParam}` });
    }
    await Promise.all([
      db.collection('articles').deleteOne({ _id: ObjectId(idParam) }),

      Author.updateOne({ _id: authorId }, { $pull: { articles: idParam } }),
    ]).then(() => res.status(204).end());

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
  } catch (error) {
    console.error(error);
  }
};

module.exports = Object.freeze(deleteArticleDB);
