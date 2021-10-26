const getElementById = async (req, res) => {
  try {
    const articleId = await search.search(req.params.id);
    if (articleId == '') {
      return res
        .status(404)
        .json({ message: `There is no document with id ${req.params.id}` });
    }
    return res.status(200).json(articleId);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Could not get document' });
  }
};

module.exports = Object.freeze(getElementById);
