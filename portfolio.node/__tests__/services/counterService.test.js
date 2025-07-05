const counterService = require('../../src/services/counterService');



describe('services/counterService.js', () => {
    test('should be defined', () => {
        expect(counterService).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof counterService).toBe('object' || 'function');
    });

    if (typeof counterService === 'object' && counterService !== null) {
        Object.keys(counterService).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof counterService[method]).toBe('function');
            });
        });
    }
});
