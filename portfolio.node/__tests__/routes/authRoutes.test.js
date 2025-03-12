const { describe, test, expect, jest } = require('@jest/globals');
const authRoutes = require('../../src/routes/authRoutes');


jest.mock('../../src/middlewares/auth', () => (req, res, next) => next());
jest.mock('../../src/middlewares/admin', () => (req, res, next) => next());


describe('routes/authRoutes.js', () => {
    test('should be defined', () => {
        expect(authRoutes).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof authRoutes).toBe('object' || 'function');
    });

    if (typeof authRoutes === 'object' && authRoutes !== null) {
        Object.keys(authRoutes).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof authRoutes[method]).toBe('function');
            });
        });
    }
});
