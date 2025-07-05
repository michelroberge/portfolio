const app = require('../src/app')



describe('app.js', () => {
    test('should be defined', () => {
        expect(app).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof app).toBe('object' || 'function');
    });

    if (typeof app === 'object' && app !== null) {
        Object.keys(app).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof app[method]).toBe('function');
            });
        });
    }
});
