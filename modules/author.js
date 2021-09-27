const { required } = require('joi');
const mongoose = require('mongoose');

const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const AuthorSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true }, // TypeError: Invalid schema configuration: `True` is not a valid type at path `name.required`.
  articles: [{ type: [String], index: { default: uuidv4 } }], // { type: [String], index: { default: uuidv4 } } //not working
  __v: { type: Number, select: false },
});

const Author = mongoose.model('author', AuthorSchema);

module.exports = Author;
