const projectRoutes = require('../../src/routes/projectRoutes');


jest.mock('../../src/middlewares/auth', () => (req, res, next) => next());
jest.mock('../../src/middlewares/admin', () => (req, res, next) => next());


describe('routes/projectRoutes.js', () => {
    test('should be defined', () => {
        expect(projectRoutes).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof projectRoutes).toBe('object' || 'function');
    });

    if (typeof projectRoutes === 'object' && projectRoutes !== null) {
        Object.keys(projectRoutes).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof projectRoutes[method]).toBe('function');
            });
        });
    }
});
