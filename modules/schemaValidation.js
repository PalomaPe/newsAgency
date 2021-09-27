const Joi = require('joi').extend(require('@joi/date'));

const aSchemaPost = Joi.object({
  id: Joi.string().length(36).required(), // null and "" need to be explicitily allowed
  title: Joi.string().max(255).required(),
  author: Joi.string().max(100).required(),
  modifiedAt: Joi.date().format('MM/DD/YYYY').less('now'), // regEx // missing past dtae validation //loupe
  publishedAt: Joi.date().format('MM/DD/YYYY').less('now'),
  /* url: Joi.when("publishedAt", {
    is: Joi.exist(),
    then: Joi.string().uri({ scheme: ["https"] }),
  }), */
  // keywords: Joi.array().items(Joi.string().required()).min(1).max(3), //are all items validates with string() ?
  readMins: Joi.number().min(1).max(20).required(),
});

const aSchemaPatch = Joi.object({
  id: Joi.string().length(36), // null and "" need to be explicitily allowed
  title: Joi.string().max(255),
  author: Joi.string().max(100),
  modifiedAt: Joi.date().format('MM/DD/YYYY').less('now'), // regEx // missing past dtae validation //loupe
  publishedAt: Joi.date().format('MM/DD/YYYY').less('now'),
  url: Joi.when('publishedAt', {
    is: Joi.exist(),
    then: Joi.string().uri({ scheme: ['https'] }),
  }),
  keywords: Joi.array().items(Joi.string()).min(1).max(3), // are all items validates with string() ?
  readMins: Joi.number().min(1).max(20),
});

async function schemaArticleValidation(article) {
  try {
    const value = await aSchemaPost.validateAsync(
      JSON.parse(article), // PARSE HERE
    );
    return typeof value.error === 'undefined';
  } catch (err) {
    console.log(err);
  }
}

module.exports = { schemaArticleValidation, aSchemaPost, aSchemaPatch };
