const { describe, test, expect, jest } = require('@jest/globals');
const searchRoutes = require('../../src/routes/searchRoutes');


jest.mock('../../src/middlewares/auth', () => (req, res, next) => next());
jest.mock('../../src/middlewares/admin', () => (req, res, next) => next());


describe('routes/searchRoutes.js', () => {
    test('should be defined', () => {
        expect(searchRoutes).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof searchRoutes).toBe('object' || 'function');
    });

    if (typeof searchRoutes === 'object' && searchRoutes !== null) {
        Object.keys(searchRoutes).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof searchRoutes[method]).toBe('function');
            });
        });
    }
});
