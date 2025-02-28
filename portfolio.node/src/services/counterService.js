const Counter = require("../models/Counters");

/**
 * Get the next unique vectorId in a multi-user safe way.
 * Uses MongoDB's atomic `$inc` operation to prevent race conditions.
 *
 * @param {string} name - The counter name (e.g., "vectorId")
 * @returns {Promise<number>} - The next incremented value
 */
async function getNextVectorId(name = "vectorId") {
  const counter = await Counter.findOneAndUpdate(
    { Name: name },  // Find by counter name
    { $inc: { Value: 1 } },  // Atomically increment the counter
    { new: true, upsert: true } // Create if not exists
  );

  return counter.Value;
}

module.exports = { getNextVectorId };
