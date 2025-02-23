const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');

// Create a simple Express app for testing purposes.
const app = express();
app.use(express.json());
app.use(cookieParser());

// Define a simple test route.
app.get('/api/test', (req, res) => res.status(200).json({ message: 'Test endpoint works' }));

describe('GET /api/test', () => {
  it('should return a JSON object with a success message', async () => {
    const response = await request(app).get('/api/test');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Test endpoint works');
  });
});
