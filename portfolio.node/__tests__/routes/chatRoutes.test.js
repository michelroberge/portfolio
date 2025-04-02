const { describe, test, expect, jest } = require('@jest/globals');
const chatRoutes = require('../../src/routes/chatRoutes');


jest.mock('../../src/middlewares/auth', () => (req, res, next) => next());
jest.mock('../../src/middlewares/admin', () => (req, res, next) => next());


describe('routes/chatRoutes.js', () => {
    test('should be defined', () => {
        expect(chatRoutes).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof chatRoutes).toBe('object' || 'function');
    });

    if (typeof chatRoutes === 'object' && chatRoutes !== null) {
        Object.keys(chatRoutes).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof chatRoutes[method]).toBe('function');
            });
        });
    }
});
