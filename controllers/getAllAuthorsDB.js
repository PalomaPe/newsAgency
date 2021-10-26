const { Author } = require('../modules/author');

const getAllAuthorsDB = (req, res) => {
  Author.find()
    .then((docs) => {
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'Could not show documents' });
    });
};

module.exports = Object.freeze(getAllAuthorsDB);
