// portfolio.node/src/validators/blogValidator.js
const Joi = require('joi');

const createBlogSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  date: Joi.string().isoDate().required(),
  excerpt: Joi.string().max(500).required(),
  body: Joi.string().required(),
});

module.exports = {
  createBlogSchema,
};
