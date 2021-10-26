const getAllArticlesDB = async (req, res) => {
  const articlesCol = await db.collection('articles').find({}).toArray();
  if (articlesCol.length == 0) {
    return res
      .status(404)
      .json({ message: 'There are not articles in the database' });
  }
  return res.status(200).json(articlesCol);
};

module.exports = Object.freeze(getAllArticlesDB);
