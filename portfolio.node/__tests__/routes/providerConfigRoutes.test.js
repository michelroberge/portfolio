const providerConfigRoutes = require('../../src/routes/admin/providerConfigRoutes');


jest.mock('../../src/middlewares/auth', () => (req, res, next) => next());
jest.mock('../../src/middlewares/admin', () => (req, res, next) => next());


describe('routes/providerConfigRoutes.js', () => {
    test('should be defined', () => {
        expect(providerConfigRoutes).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof providerConfigRoutes).toBe('object' || 'function');
    });

    if (typeof providerConfigRoutes === 'object' && providerConfigRoutes !== null) {
        Object.keys(providerConfigRoutes).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof providerConfigRoutes[method]).toBe('function');
            });
        });
    }
});
