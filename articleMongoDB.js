const { Mongoose } = require('mongoose');
const moongose = require('moongose');

const { schema } = Mongoose;

const articleSchema = new Schema({
  id: {
    type: String,
    length: 36,
    required: true,
  },
  title: {
    type: String,
    max: 255,
    required: true,
  },
  author: {
    type: String,
    max: 100,
    required: true,
  },
  modifiedAt: {
    type: Date,
  },
  publishedAt: {
    type: Date,
    default: Date,
  },
  url: Joi.when('publishedAt', {
    is: Joi.exist(),
    then: Joi.string().uri({ scheme: ['https'] }),
  }),
  keywords: Joi.array().items(Joi.string().required()).min(1).max(3),
  readMins: Joi.number().min(1).max(20).required(),
});
