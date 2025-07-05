const blogRoutes = require('../../src/routes/blogRoutes');


jest.mock('../../src/middlewares/auth', () => (req, res, next) => next());
jest.mock('../../src/middlewares/admin', () => (req, res, next) => next());


describe('routes/blogRoutes.js', () => {
    test('should be defined', () => {
        expect(blogRoutes).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof blogRoutes).toBe('object' || 'function');
    });

    if (typeof blogRoutes === 'object' && blogRoutes !== null) {
        Object.keys(blogRoutes).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof blogRoutes[method]).toBe('function');
            });
        });
    }
});
