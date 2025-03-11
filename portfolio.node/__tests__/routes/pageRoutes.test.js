const { describe, test, expect, jest } = require('@jest/globals');
const pageRoutes = require('../../src/routes/pageRoutes');


jest.mock('../../src/middlewares/auth', () => (req, res, next) => next());
jest.mock('../../src/middlewares/admin', () => (req, res, next) => next());


describe('routes/pageRoutes.js', () => {
    test('should be defined', () => {
        expect(pageRoutes).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof pageRoutes).toBe('object' || 'function');
    });

    if (typeof pageRoutes === 'object' && pageRoutes !== null) {
        Object.keys(pageRoutes).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof pageRoutes[method]).toBe('function');
            });
        });
    }
});
