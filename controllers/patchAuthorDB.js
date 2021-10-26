const { Author } = require('../modules/author');

const patchAuthorDB = async (req, res) => {
  const idParam = req.params.id;
  Author.updateOne({ _id: idParam }, req.body)
    .then((result) => {
      if (result.n) {
        return res
          .status(200)
          .json({ message: `Document with id ${idParam} was updated` });
      }
      return res
        .status(404)
        .json({ message: `Could not found document with id ${idParam}` });
    })
    .catch((err) => {
      /**
       * REVIEW:
       *  Si ocurre un error en la ejecución, la petición actual se queda colgada infinitamente,
       *  dado que no estás devolviendo nada utilizando res.status(5xx)... etc.
       *
       *  Siempre se debe enviar una respuesta, de lo contrario el cliente recibirá un timeout
       *  al cabo de X tiempo, pero la petición seguirá siendo procesada por el servidor,
       *  consumiento recursos.
       */
      console.error(err);
      // FIX:
      return res
        .status(500)
        .json({ message: `Could not update document with id ${idParam}` });
    });
};

module.exports = Object.freeze(patchAuthorDB);
