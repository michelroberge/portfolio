const userRoutes = require('../../src/routes/userRoutes');


jest.mock('../../src/middlewares/auth', () => (req, res, next) => next());
jest.mock('../../src/middlewares/admin', () => (req, res, next) => next());


describe('routes/userRoutes.js', () => {
    test('should be defined', () => {
        expect(userRoutes).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof userRoutes).toBe('object' || 'function');
    });

    if (typeof userRoutes === 'object' && userRoutes !== null) {
        Object.keys(userRoutes).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof userRoutes[method]).toBe('function');
            });
        });
    }
});
