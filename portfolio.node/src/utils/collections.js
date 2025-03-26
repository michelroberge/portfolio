const Page = require("../models/Page");
const BlogEntry = require("../models/BlogEntry");
const Project = require("../models/Project");
const BookChapter = require("../models/BookChapter");
const CareerTimeline = require("../models/CareerTimeline");

const getCollectionStats = async (Collection) => {
    const count = await Collection.countDocuments();
    const latest = await Collection.findOne({}, {}, { sort: { 'updatedDate': -1 } });
    return {
        count: count,
        latestUpdatedDate: latest ? latest.updatedDate : null,
    };
};

const getCollections = async () => {
    return [
        { name: Page.collection.collectionName, collection: Page },
        { name: BlogEntry.collection.collectionName, collection: BlogEntry },
        { name: Project.collection.collectionName, collection: Project },
        { name: BookChapter.collection.collectionName, collection: BookChapter },
        { name: CareerTimeline.collection.collectionName, collection: CareerTimeline },
    ];
};

const getCollectionsWithStats = async () => {
    const collections = await getCollections();

    const collectionsWithStatsArray = await Promise.all(
        collections.map(async (collection) => {
            const stats = await getCollectionStats(collection.collection);
            return {
                ...collection,
                count: stats.count,
                latestUpdatedDate: stats.latestUpdatedDate,
            };
        })
    );

    return collectionsWithStatsArray;
};

const getCollectionsWithStatsAsMap = async() =>{
    const collectionsWithStatsArray = await getCollectionsWithStats();
    // Convert the array to a lookup map.
    const collectionsWithStatsMap = collectionsWithStatsArray.reduce((map, collection) => {
        map[collection.name] = collection;
        return map;
    }, {});

    return collectionsWithStatsMap;
}

const getCollectionByName = async (collectionName) => {
    const collections = await getCollections();
    const matchedCollection = collections.find(
        collection => collection.name === collectionName
    );

    return matchedCollection.collection;
};

const collections = {
    getCollectionsWithStatsAsMap,
    getCollectionsWithStats,
    getCollections,
    getCollectionByName,
};

module.exports = collections;