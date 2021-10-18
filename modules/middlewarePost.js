/**
 * REVIEW:
 * ¿Cuál es la diferencia con middlewarePatch?
 * Generalmente hacemos los middlewares genéricos sin importar el método HTTP.
 */

const middleware = (schema, property) => (req, res, next) => {
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
