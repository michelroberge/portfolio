const oauthRoutes = require('../../src/routes/oauthRoutes');


jest.mock('../../src/middlewares/auth', () => (req, res, next) => next());
jest.mock('../../src/middlewares/admin', () => (req, res, next) => next());


describe('routes/oauthRoutes.js', () => {
    test('should be defined', () => {
        expect(oauthRoutes).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof oauthRoutes).toBe('object' || 'function');
    });

    if (typeof oauthRoutes === 'object' && oauthRoutes !== null) {
        Object.keys(oauthRoutes).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof oauthRoutes[method]).toBe('function');
            });
        });
    }
});
