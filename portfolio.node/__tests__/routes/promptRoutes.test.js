const promptRoutes = require('../../src/routes/admin/promptRoutes');


jest.mock('../../src/middlewares/auth', () => (req, res, next) => next());
jest.mock('../../src/middlewares/admin', () => (req, res, next) => next());


describe('routes/promptRoutes.js', () => {
    test('should be defined', () => {
        expect(promptRoutes).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof promptRoutes).toBe('object' || 'function');
    });

    if (typeof promptRoutes === 'object' && promptRoutes !== null) {
        Object.keys(promptRoutes).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof promptRoutes[method]).toBe('function');
            });
        });
    }
});
