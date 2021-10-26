const { Author } = require('../modules/author');

const postAuthorDB = async (req, res) => {
  /**
   * REVIEW: ¿Validación?.
   */
  const author = req.body;
  Author.create(author)
    .then(() => {
      res.status(200).json({ message: 'Author posted in database' });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json({ message: 'Could not post in database' });
    });
};

module.exports = Object.freeze(postAuthorDB);
