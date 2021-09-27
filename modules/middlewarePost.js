const Joi = require("joi").extend(require("@joi/date"));

const middleware = (schema, property) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  const valid = error == null;

  if (valid) {
    next();
  } else {
    const { details } = error;
    const message = details.map((i) => i.message).join(",");

    res.status(422).json({ error: message });
  }
};

module.exports = middleware;
