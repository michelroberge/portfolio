const Page = require("../models/Page");
const BlogEntry = require("../models/BlogEntry");
const Project = require("../models/Project");
const BookChapter = require("../models/BookChapter");

const blogService = require("../services/blogService");
const projectService = require("../services/projectService");
const pageService = require("../services/pageService");
const bookService = require("../services/bookService");

module.exports = {
  [BlogEntry.collection.collectionName]: blogService,
  [Project.collection.collectionName]: projectService,
  [Page.collection.collectionName]: pageService,
  [BookChapter.collection.collectionName]: bookService
};