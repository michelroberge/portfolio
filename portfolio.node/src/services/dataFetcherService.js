const { searchQdrant } = require("../services/qdrantService");
const Project = require("../models/Project");
const BlogEntry = require("../models/BlogEntry");
const Page = require("../models/Page");
const CareerTimeline = require("../models/CareerTimeline");
const BookChapter = require("../models/BookChapter");

const { extractMetadataFromQuery } = require("../utils/queryUtils"); // Optional metadata extraction

const COLLECTION_NAMES = {
    projects: Project.collection.collectionName,
    blogs: BlogEntry.collection.collectionName,
    pages: Page.collection.collectionName,
    jobs: CareerTimeline.collection.collectionName,
    books: BookChapter.collection.collectionName,
};

const collectionOrder = {
    "project_search": [COLLECTION_NAMES.projects, COLLECTION_NAMES.blogs, COLLECTION_NAMES.jobs, "files", COLLECTION_NAMES.pages],
    "blog_lookup": [COLLECTION_NAMES.blogs, COLLECTION_NAMES.projects, COLLECTION_NAMES.jobs, COLLECTION_NAMES.pages, "files"],
    "professional_lookup": [COLLECTION_NAMES.jobs, COLLECTION_NAMES.projects, COLLECTION_NAMES.books, COLLECTION_NAMES.blogs, COLLECTION_NAMES.pages, "files"],
    "general_knowledge": [COLLECTION_NAMES.books, COLLECTION_NAMES.pages, COLLECTION_NAMES.jobs, COLLECTION_NAMES.blogs, COLLECTION_NAMES.projects, "files"]
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
    const metadata = extractMetadataFromQuery(parameters.userQuery) || {}; 

    // Step 3️⃣: Query Qdrant Collections in Sorted Order Until We Have Enough Results
    const retrievedDocs = [];
    const targetDocCount = 10; // Define threshold for relevant results
    const queryVector = parameters.queryVector; // 🔹 Use pre-generated vector

    if (!queryVector) {
        console.error("❌ Query vector is missing! Cannot search Qdrant.");
        return { userQuery: parameters.userQuery, retrievedDocs };
    }

    const collectionLimits = { primary: 5, secondary: 3, tertiary: 3, quaternary: 2 };
    let collectionIndex = 0;
    const docIdsByCollection = {}; // Store retrieved vector IDs by collection

    for (const collection of sortedCollections) {
        if (retrievedDocs.length >= targetDocCount) break; // Stop if enough results found

        const limit = collectionIndex === 0 ? collectionLimits.primary :
            collectionIndex === 1 ? collectionLimits.secondary : 
            collectionIndex === 2 ? collectionLimits.tertiary : 
            collectionLimits.quaternary;

        const minScore = (collectionIndex * 0.1); // Increase threshold for less relevant collections

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
        await fetchMongoDocs(docIdsByCollection) : await Page.find({ slug: "about" }).lean();

    console.log(`✅ Fetched ${fullDocuments.length} full documents from MongoDB.`);

    // Step 5️⃣: Return structured results with enriched context
    return JSON.stringify(fullDocuments, null, 2);
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

async function FetchDefaultContextData() {

    let context = "";

    const about = await Page.findOne({ slug: "about" });
    if (about) {
        context += `# ABOUT\n\n`;
        context += `${about.content}\n\n`;
    }

    context += await FetchProjects();
    context += await FetchBlogs();
    context += await FetchCareerTimeline();

    return context;
}

async function FetchProjects() {
    let context = "# PORTFOLIO PROJECTS \n\n";
    const projects = await Project.find();
    projects.forEach((p, i) => {
        context += `## Project ${i + 1}\n\n### ${p.title}\n\n### Excerpt\n\n${p.excerpt}\n\n`;
    });
    
    return context;
}


async function FetchBlogs() {
    let context = "# BLOG ENTRIES\n\n";
    const blogs = await BlogEntry.find();
    blogs.forEach((b, i) => {
        context += `## ${b.title}\n### Excerpt\n${b.excerpt}\n\n### Content\n${b.Body}`;
    });
    return context;
}

async function FetchCareerTimeline() {
    let context = "# PROFESSIONAL EXPERIENCE\n\n";
    const careerEntries = await CareerTimeline.find();

    careerEntries.forEach((entry) => {
        // Format dates
        const startDate = entry.startDate ? new Date(entry.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Unknown';
        const endDate = entry.endDate ? new Date(entry.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present';
        const duration = entry.endDate ?
            calculateDuration(entry.startDate, entry.endDate) :
            calculateDuration(entry.startDate, new Date());

        context += `## ${entry.title} at ${entry.company}\n`;
        context += `**Period**: ${startDate} to ${endDate} (${duration})\n\n`;

        if (entry.description) {
            context += `### Responsibilities & Achievements\n${entry.description}\n\n`;
        }

        if (entry.skills && entry.skills.length > 0) {
            context += `### Skills Utilized\n${entry.skills.join(", ")}\n\n`;
        }

        // Add divider between entries
        context += "---\n\n";
        return context;
    });
    return context;
}

function calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();

    let duration = '';
    if (years > 0) {
        duration += `${years} year${years > 1 ? 's' : ''}`;
    }
    if (months > 0 || (years > 0 && months < 0)) {
        const adjustedMonths = months < 0 ? 12 + months : months;
        if (duration.length > 0) duration += ', ';
        duration += `${adjustedMonths} month${adjustedMonths > 1 ? 's' : ''}`;
    }
    if (duration === '') {
        // For very short durations
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        duration = `${days} day${days > 1 ? 's' : ''}`;
    }

    return duration;
}

module.exports = { fetchRelevantData };
