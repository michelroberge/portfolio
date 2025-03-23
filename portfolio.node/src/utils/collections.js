const Page = require("../models/Page");
const BlogEntry = require("../models/BlogEntry");
const Project = require("../models/Project");
const BookChapter = require("../models/BookChapter");
const CareerTimeline = require("../models/CareerTimeline");

const collections = [
    {Name : Page.collection.collectionName, Collection: Page}, 
    {Name : BlogEntry.collection.collectionName, Collection: BlogEntry}, 
    {Name: Project.collection.collectionName, Collection: Project},
    {Name: BookChapter.collection.collectionName, Collection: Project},
    {Name: CareerTimeline.collection.collectionName, Collection: CareerTimeline }
];

module.exports = collections;