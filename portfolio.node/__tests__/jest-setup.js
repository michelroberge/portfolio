const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.test' });

let mongoServer;

beforeAll(async () => {
    // Start in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGO_URI = mongoUri;

    // Connect Mongoose to in-memory database
    await mongoose.connect(mongoUri);

    // Mock external dependencies (Ollama, Qdrant)
    jest.mock('../src/services/ollamaService', () => ({
        generateEmbedding: jest.fn().mockResolvedValue([0.1, 0.2, 0.3]),
    }));

    jest.mock('../src/services/qdrantService', () => ({
        searchVectors: jest.fn().mockResolvedValue([]),
    }));
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});
