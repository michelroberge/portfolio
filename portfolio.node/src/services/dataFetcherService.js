const { searchQdrant } = require("../services/qdrantService");
const Project = require("../models/Project");
const BlogEntry = require("../models/BlogEntry");
const Page = require("../models/Page");

// const { extractMetadataFromQuery } = require("../utils/queryUtils"); // Optional metadata extraction

const COLLECTION_NAMES = {
    projects: Project.collection.collectionName,
    blogs: BlogEntry.collection.collectionName,
    pages: Page.collection.collectionName
};

const collectionOrder = {
    "project_search": [COLLECTION_NAMES.projects, COLLECTION_NAMES.blogs, "files", COLLECTION_NAMES.pages],
    "blog_lookup": [COLLECTION_NAMES.blogs, COLLECTION_NAMES.projects, COLLECTION_NAMES.pages, "files"],
    "general_knowledge": [COLLECTION_NAMES.pages, COLLECTION_NAMES.blogs, COLLECTION_NAMES.projects, "files"]
};

/**
 * Fetches relevant data based on intent using Qdrant search & retrieves full MongoDB documents.
 * @param {object} parameters - User query parameters.
 * @param {string} intent - The detected intent.
 * @returns {Promise<object>} - Resolved parameter values.
 */
async function fetchRelevantData(parameters, intent) {
    console.log(`🔄 Fetching relevant data for intent: "${intent}"`);

    // Step 1️⃣: Define collection search order based on intent
    const sortedCollections = collectionOrder[intent] || collectionOrder["general_knowledge"];

    // Step 2️⃣: Extract metadata from query (Optional Enhancement)
    // const metadata = extractMetadataFromQuery(parameters.userQuery) || {}; 

    // Step 3️⃣: Query Qdrant Collections in Sorted Order Until We Have Enough Results
    const retrievedDocs = [];
    const targetDocCount = 10; // Define threshold for relevant results
    const queryVector = parameters.queryVector; // 🔹 Use pre-generated vector
    
    if (!queryVector) {
        console.error("❌ Query vector is missing! Cannot search Qdrant.");
        return { userQuery: parameters.userQuery, retrievedDocs };
    }

    const collectionLimits = { primary: 5, secondary: 3, tertiary: 2 };
    let collectionIndex = 0;
    const docIdsByCollection = {}; // Store retrieved vector IDs by collection

    for (const collection of sortedCollections) {
        if (retrievedDocs.length >= targetDocCount) break; // Stop if enough results found

        const limit = collectionIndex === 0 ? collectionLimits.primary :
                      collectionIndex === 1 ? collectionLimits.secondary :
                                              collectionLimits.tertiary;

        const minScore = 0.3 + (collectionIndex * 0.1); // Increase threshold for less relevant collections

        console.log(`🔎 Searching Qdrant: Collection "${collection}" (Limit: ${limit}, MinScore: ${minScore})`);
        
        const searchResults = await searchQdrant(queryVector, collection, limit, minScore);

        if (searchResults.length > 0) {
            docIdsByCollection[collection] = searchResults.map(doc => doc.id);
        }

        retrievedDocs.push(...searchResults);
        collectionIndex++;
    }

    console.log(`✅ Retrieved ${retrievedDocs.length} relevant document IDs from Qdrant.`);

    // Step 4️⃣: Fetch Full Documents from MongoDB
    const fullDocuments = docIdsByCollection.length > 0 ? 
        await fetchMongoDocs(docIdsByCollection) : await Page.find({slug: "about"}).lean();

    console.log(`✅ Fetched ${fullDocuments.length} full documents from MongoDB.`);

    // Step 5️⃣: Return structured results with enriched context
    return  JSON.stringify(fullDocuments, null, 2);
}

/**
 * Fetches full MongoDB documents based on Qdrant search results, including GridFS files.
 * @param {object} docIdsByCollection - Mapping of collection names to arrays of vectorIds.
 * @returns {Promise<object[]>} - Retrieved documents.
 */
async function fetchMongoDocs(docIdsByCollection) {
    let allDocuments = [];

    // Mapping of standard collections
    const collectionMap = {
        "projects": Project,
        "blogs": BlogEntry,
        "pages": Page
    };

    for (const [collection, docIds] of Object.entries(docIdsByCollection)) {
        if (docIds.length === 0) continue; // Skip if no IDs were found

        console.log(`📂 Fetching ${docIds.length} documents from "${collection}" collection...`);

        // Handle standard MongoDB collections
        if (collectionMap[collection]) {
            const model = collectionMap[collection];
            const documents = await model.find({ vectorId: { $in: docIds } }).lean();
            allDocuments.push(...documents);
            continue;
        }

        // Handle GridFS (for "files" collection)
        if (collection === "files") {
            console.log(`📂 Fetching ${docIds.length} file metadata from GridFS...`);
            const gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "fs" });

            const files = await mongoose.connection.db
                .collection("fs.files")
                .find({ "metadata.vectorId": { $in: docIds } }) // Match vectorId in metadata
                .toArray();

            // Extract only relevant metadata
            const fileMetadata = files.map(file => ({
                _id: file._id,
                filename: file.filename,
                vectorId: file.metadata.vectorId,
                metadata: file.metadata || {}
            }));

            allDocuments.push(...fileMetadata);
        }
    }

    return allDocuments;
}

module.exports = { fetchRelevantData };
