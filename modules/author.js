const Joi = require("joi").extend(require("@joi/date"));
const mongoose = require("mongoose");

const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid");

const AuthorSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  articles: [{ type: [String], index: { default: uuidv4 } }],
  __v: { type: Number, select: false },
});

const authorSchemaPost = Joi.object({
  name: Joi.string().required(),
  articles: Joi.array().items(Joi.string().length(36)).required(),
});

const authorSchemaPatch = Joi.object({
  name: Joi.string(),
  articles: Joi.array().items(Joi.string().length(36)),
});

const Author = mongoose.model("author", AuthorSchema);

module.exports = {
  Author,
  authorSchemaPost,
  authorSchemaPatch,
};
