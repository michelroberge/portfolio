const { getVectorsByCollectionName } = require("./qdrantService");
const { PCA } = require('ml-pca');

/**
 * Normalize vectors using min-max scaling
 * @param {number[][]} vectors - Input vectors
 * @returns {number[][]} Normalized vectors
 */
function normalizeVectors(vectors) {
    // Find min and max for each dimension
    const dims = vectors[0].length;
    const mins = new Array(dims).fill(Infinity);
    const maxs = new Array(dims).fill(-Infinity);

    // Find global mins and maxs
    vectors.forEach(vector => {
        vector.forEach((val, i) => {
            mins[i] = Math.min(mins[i], val);
            maxs[i] = Math.max(maxs[i], val);
        });
    });

    // Normalize using min-max scaling
    return vectors.map(vector => 
        vector.map((val, i) => {
            // Prevent division by zero
            const range = maxs[i] - mins[i];
            return range !== 0 ? (val - mins[i]) / range : 0;
        })
    );
}

/**
 * Reduce dimensions using PCA (Principal Component Analysis)
 * @param {number[][]} vectors - Input vectors
 * @param {number} targetDimensions - Number of target dimensions
 * @returns {number[][]} Reduced dimension vectors
 */
function pcaProjection(vectors, targetDimensions = 2) {
    // Perform PCA
    const pca = new PCA(vectors, { nComponents: targetDimensions });
    
    // Convert PCA matrix to array of arrays
    const projectedMatrix = pca.predict(vectors);
    const projectedVectors = [];
    
    for (let i = 0; i < projectedMatrix.rows; i++) {
        const row = [];
        for (let j = 0; j < projectedMatrix.columns; j++) {
            row.push(projectedMatrix.get(i, j));
        }
        projectedVectors.push(row);
    }
    
    return projectedVectors;
}

/**
 * Scale vectors to a grid
 * @param {number[][]} vectors - Input vectors
 * @param {number} gridSize - Size of the grid
 * @returns {number[][]} Grid-scaled vectors
 */
function scaleToGrid(vectors, gridSize = 100) {
    // Find min and max for each dimension separately
    const mins = [
        Math.min(...vectors.map(v => v[0])), 
        Math.min(...vectors.map(v => v[1]))
    ];
    const maxs = [
        Math.max(...vectors.map(v => v[0])), 
        Math.max(...vectors.map(v => v[1]))
    ];

    // Scale to grid
    return vectors.map(vector => 
        vector.map((val, i) => {
            // Linear scaling to grid
            const scaled = Math.floor(
                ((val - mins[i]) / (maxs[i] - mins[i] || 1)) * (gridSize - 1)
            );
            return scaled;
        })
    );
}

/**
 * Calculate point density
 * @param {number[][]} vectors - Input vectors
 * @returns {Object[]} Vectors with density
 */
function calculateDensity(vectors) {
    const densityMap = new Map();

    // Calculate density
    vectors.forEach(vector => {
        const key = vector.slice(0, 2).join(',');
        densityMap.set(key, (densityMap.get(key) || 0) + 1);
    });

    // Convert to array with density
    return Array.from(densityMap.entries()).map(([key, density]) => ({
        coordinates: key.split(',').map(Number),
        density
    }));
}

/**
 * Project vectors to 2D with density
 * @param {number[][]} vectors - Input vectors
 * @param {Object} options - Configuration options
 * @returns {Object[]} Projected vectors with density
 */
function projectVectorsTo2D(vectors, options = {}) {
    const {
        gridSize = 100
    } = options;

    // Validate input
    if (!vectors || vectors.length === 0) return [];

    // Normalize vectors
    const normalizedVectors = normalizeVectors(vectors);

    // Reduce dimensions using PCA (more stable than random projection)
    const projectedVectors = pcaProjection(normalizedVectors, 2);

    // Scale to grid
    const gridVectors = scaleToGrid(projectedVectors, gridSize);

    // Calculate density
    return calculateDensity(gridVectors);
}

const getProjected2DVectors = async (collectionName) => {
    // const embeddings = await getVectorsByCollectionName(collectionName);
    // return projectVectorsTo2D(embeddings, {gridSize: 100});
    return await getVectorsByCollectionName(collectionName);
}

module.exports = {
    getProjected2DVectors
};