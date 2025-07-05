const commentRoutes = require('../../src/routes/commentRoutes');


jest.mock('../../src/middlewares/auth', () => (req, res, next) => next());
jest.mock('../../src/middlewares/admin', () => (req, res, next) => next());


describe('routes/commentRoutes.js', () => {
    test('should be defined', () => {
        expect(commentRoutes).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof commentRoutes).toBe('object' || 'function');
    });

    if (typeof commentRoutes === 'object' && commentRoutes !== null) {
        Object.keys(commentRoutes).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof commentRoutes[method]).toBe('function');
            });
        });
    }
});
