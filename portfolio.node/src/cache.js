const cache = {
    blogs: {},
    projects: {},
    "blogs-timestamp": 0,
    "projects-timestamp": 0,
  };
  
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  
  // ✅ Check if cache is valid based on timestamp
  function isCacheValid(key) {
    return Date.now() - cache[`${key}-timestamp`] < CACHE_TTL;
  }
  
  // ✅ Get all cached data or fetch if expired
  async function getAllCached(key, fetchFunction) {
    if (isCacheValid(key)) {
      console.log(`Using cached ${key} data`);
      return Object.values(cache[key]); // Return all cached items
    }
  
    console.log(`Refreshing ${key} cache`);
    const data = await fetchFunction();
    cache[key] = {}; // Reset key storage
  
    data.forEach((item) => {
      cache[key][item._id] = item; // Store by ID
    });
  
    cache[`${key}-timestamp`] = Date.now();
    return data;
  }
  
  // ✅ Get a single item from cache or fetch if missing
  async function getCachedById(key, id, fetchFunction) {
    if (cache[key][id]) {
      console.log(`Using cached ${key} entry: ${id}`);
      return cache[key][id];
    }
  
    console.log(`Fetching ${key} entry: ${id} from DB`);
    const item = await fetchFunction(id);
    if (item) {
      cache[key][id] = item;
    }
    return item;
  }
  
  // ✅ Add a new item to cache
  function addToCache(key, item) {
    cache[key][item._id] = item;
  }
  
  // ✅ Reset cache manually (useful for updates/deletes)
  function clearCache(key) {
    cache[key] = {};
    cache[`${key}-timestamp`] = 0;
  }
  
  module.exports = { getAllCached, getCachedById, addToCache, clearCache };
  