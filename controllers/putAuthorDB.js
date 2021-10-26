const { Author } = require('../modules/author');

const putAuthorDB = async (req, res) => {
  const idParam = req.params.id;
  Author.updateOne({ _id: idParam }, req.body, {
    currentDate: { lastModified: true },
    upsert: true,
  })
    .then((results) => {
      if (results.nModified) {
        return res.status(200).json({
          message: `Document with id ${idParam} was updated`,
        });
      }
      /**
       * REVIEW:
       *  En este caso sería 201 Created.
       */
      // FIX:
      return res.status(201).json({
        message: `Document with id ${idParam} was successfully added`,
      });
    })
    .catch((error) => {
      /**
       * Review:
       * Acá solo entra si ocurrió un error con la consulta,
       * pero no si el author no apareción. Sobre todo porque tienes
       * un upsert, lo cual si no está lo insertará.
       *
       * Lo correcto es devolver error 500 (al menos) para indicar que,
       * el problema es del API, el servidor, y no del cliente.
       */
      console.error(error);
      // FIX:
      res
        .status(500)
        .send({ message: `Could not update document with id ${idParam}` });
    });
};

module.exports = Object.freeze(putAuthorDB);
