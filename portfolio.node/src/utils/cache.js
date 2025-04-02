const NodeCache = require("node-cache");

// Ensure a single cache instance shared across all modules
const cache = new NodeCache({ stdTTL: 0, checkperiod: 600 });

module.exports = cache;
