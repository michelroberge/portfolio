const aiRoutes = require('../../src/routes/aiRoutes');


jest.mock('../../src/middlewares/auth', () => (req, res, next) => next());
jest.mock('../../src/middlewares/admin', () => (req, res, next) => next());


describe('routes/aiRoutes.js', () => {
    test('should be defined', () => {
        expect(aiRoutes).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof aiRoutes).toBe('object' || 'function');
    });

    if (typeof aiRoutes === 'object' && aiRoutes !== null) {
        Object.keys(aiRoutes).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof aiRoutes[method]).toBe('function');
            });
        });
    }
});
