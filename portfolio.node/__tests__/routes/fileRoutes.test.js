const fileRoutes = require('../../src/routes/fileRoutes');


jest.mock('../../src/middlewares/auth', () => (req, res, next) => next());
jest.mock('../../src/middlewares/admin', () => (req, res, next) => next());


describe('routes/fileRoutes.js', () => {
    test('should be defined', () => {
        expect(fileRoutes).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof fileRoutes).toBe('object' || 'function');
    });

    if (typeof fileRoutes === 'object' && fileRoutes !== null) {
        Object.keys(fileRoutes).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof fileRoutes[method]).toBe('function');
            });
        });
    }
});
