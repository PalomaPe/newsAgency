// REVIEW:
// Utiliza variables descriptivas.
// FIX:
const validation = require('../modules/validation');
const post = require('../modules/post');

const postArticle = async (req, res) => {
  try {
    const article = req.body;
    // REVIEW:
    // Se valida sin importar el cliente, "from Postman" no aplica.
    // FIX:
    const errMessages = await validation.articleValidationReview(article);
    if (errMessages == '') {
      await post.appendToDB(article);
      res.status(201).json({ message: 'Posted in db' });
    } else {
      res.status(400).json({ message: errMessages });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Could not post' });
  }
};

module.exports = Object.freeze(postArticle);
