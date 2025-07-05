const swagger = require('../../src/config/swagger');



describe('config/swagger.js', () => {
    test('should be defined', () => {
        expect(swagger).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof swagger).toBe('object' || 'function');
    });

    if (typeof swagger === 'object' && swagger !== null) {
        Object.keys(swagger).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof swagger[method]).toBe('function');
            });
        });
    }
});
