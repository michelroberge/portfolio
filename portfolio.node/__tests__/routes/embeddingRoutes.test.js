const { describe, test, expect, jest } = require('@jest/globals');
const embeddingRoutes = require('../../src/routes/embeddingRoutes');


jest.mock('../../src/middlewares/auth', () => (req, res, next) => next());
jest.mock('../../src/middlewares/admin', () => (req, res, next) => next());


describe('routes/embeddingRoutes.js', () => {
    test('should be defined', () => {
        expect(embeddingRoutes).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof embeddingRoutes).toBe('object' || 'function');
    });

    if (typeof embeddingRoutes === 'object' && embeddingRoutes !== null) {
        Object.keys(embeddingRoutes).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof embeddingRoutes[method]).toBe('function');
            });
        });
    }
});
