// portfolio.node/src/validators/blogValidator.js
const Joi = require('joi');

const createBlogSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  publishAt: Joi.string().isoDate().required(),
  isDraft: Joi.boolean().required(),
  excerpt: Joi.string().max(500).required(),
  body: Joi.string().required(),
  tags: Joi.array().required(),
});

module.exports = {
  createBlogSchema,
};
