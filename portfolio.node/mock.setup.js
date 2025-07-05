module.exports = function setupMocks() {
  jest.mock("./src/services/qdrantService", () => ({
    initCollection: jest.fn().mockResolvedValue(undefined),
    storeEmbedding: jest.fn().mockResolvedValue(undefined),
    deleteEmbedding: jest.fn().mockResolvedValue(undefined),
    searchQdrant: jest.fn().mockResolvedValue([]),
    dropCollection: jest.fn().mockResolvedValue(undefined),
    getVectorsByCollectionName: jest.fn().mockResolvedValue([]),
  }));
  jest.mock("./src/services/embeddingService", () => ({
    generateEmbeddings: jest.fn().mockResolvedValue(Array(4096).fill(0)), // or whatever shape is expected
    // Add other embeddingService exports as needed
  }));
  // Add more global mocks here as needed
}; 