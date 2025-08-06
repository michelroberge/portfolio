const mongoose = require("mongoose");
const Page = require("../models/Page"); // Assuming this is your original book model
const BookChapter = require("../models/BookChapter"); // The new model to store paragraphs
const { generateEmbeddings } = require("./embeddingService");
const { storeEmbedding } = require("./qdrantService");

async function extractAndStoreChapters(slug) {
  try {

    const page = await Page.findOne({ slug });
    if (!page) {
      console.log("No book found with the given slug.");
      return;
    }

    const { title, content, tags } = page;

    // Split content by paragraphs (assuming each paragraph starts with #)
    const chapters = content.split(/(?=^#)/gm).map((chapter, index) => ({
      booktitle: title,
      chapter: chapter.trim(),
      chapterno: index + 1,
      content: chapter.trim(),
      tags,
    }));

    for (const chapter of chapters) {
      await BookChapter.create(chapter);
    }

    console.log("Book content successfully split and stored.");
  } catch (error) {
    console.error("Error extracting and storing chapters:", error);
  }
};

async function deleteBook(slug) {
  try {
    const page = await Page.findOne({ slug });
    if (!page) {
      console.log("No book found with the given slug.");
      return;
    }

    await BookChapter.deleteMany({ booktitle: page.title });
    console.log("All chapters deleted for book:", page.title);
  } catch (error) {
    console.error("Error deleting book chapters:", error);
  }
};

async function getBook(slug) {
  const page = await Page.findOne({ slug });
  if (!page) {
    console.log("No book found with the given slug.");
    return;
  }

  return await BookChapter.find({ booktitle: page.title });
}

async function updateChapterEmbeddings(chapter) {
  const text = `${chapter.title} ${chapter.content}`;

  const embedding = await generateEmbeddings(text);
  if (embedding){
    await storeEmbedding(BookChapter.collection.collectionName, chapter.vectorId, embedding, {
      title: chapter.booktitle,
      tags: chapter.tags || [],
    });
  }
  else{
    res.status(500).json({ error: "Error storing embedding. More details on server logs." });
  }
}

/**
 * generic find with optional filters.
 * @param {Object} [filter={}] - MongoDB filter object
 * @returns {Promise<Object>} List of blogs
 */
async function findOne(filter = {}) {
  return BookChapter.findOne(filter);
}

/**
 * generic find with optional filters.
 * @param {Object} [filter={}] - MongoDB filter object
 * @returns {Promise<Array>} List of blogs
 */
async function find(filter = {}) {
  return BookChapter.find(filter);
}

async function getSearchResultByVectorId(filter) {
  const chapter = await findOne(filter);
  return {
    _id: chapter._id,
    title: chapter.title,
    link: `/chapters/${chapter._id}`,
    excerpt: chapter.booktitle,
    type: 'chapter'
  };
}

module.exports = {
  extractAndStoreChapters,
  deleteBook,
  getBook,
  updateChapterEmbeddings,
  find,
  findOne,
  getSearchResultByVectorId
};
