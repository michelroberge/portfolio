require('dotenv').config({ path: '.env.test' });
jest.setTimeout(10000); // Increase the global timeout to 10 seconds

const setupMocks = require("./mock.setup.js");
setupMocks();
