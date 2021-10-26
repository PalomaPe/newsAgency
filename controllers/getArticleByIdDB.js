const { ObjectId } = require('mongodb');

const getArticleByIdDB = async (req, res) => {
  const idParam = req.params.id;
  try {
    const articlesCol = await db
      .collection('articles')
      .find({ _id: ObjectId(idParam) })
      .toArray();

    // REVIEW:
    //  Acá es donde revisas si articlesCol no es nulo ni vacío
    //  y si es así devuelves 404.
    if (articlesCol.length == 0) {
      res
        .status(404)
        .json({ message: `There is no document with id ${idParam}` });
    } else {
      res.status(200).json(articlesCol);
    }
  } catch (err) {
    /**
     * REVIEW:
     *  Si entra a este bloque, es porque ocurrio un error en tiempo de ejcución
     *  y no un error de que no se encontró el documento.
     *
     *  Si ese llegase a ser el caso, la consulta no da un error,
     *  pero si retorna un valor vació, po lo que nunca entra al catch.
     *
     * */
    console.log(err);
  }
};

module.exports = Object.freeze(getArticleByIdDB);
