/**
 * REVIEW:
 * ¿Cuál es la diferencia con middlewarePost?
 * Generalmente hacemos los middlewares genéricos sin importar el método HTTP.
 */

/*
    FIX: No hay diferencia entre los middlewares,
    solo cambia el parametro de schema pasado segun el método sea PATCH o POST.
    Se elimina una file de middleware, y el middleware común ahora es mValidation.js
*/

const middleware = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  const valid = error == null;

  if (valid) {
    next();
  } else {
    const { details } = error;
    const message = details.map((i) => i.message).join(",");

    console.log("error", message);
    res.status(422).json({ error: message });
  }
};

module.exports = middleware;
