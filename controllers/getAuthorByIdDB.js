const { Author } = require('../modules/author');

const getAuthorByIdDB = async (req, res) => {
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
};

module.exports = Object.freeze(getAuthorByIdDB);
