const warmUpService = require('../../src/services/warmUpService');



describe('services/warmUpService.js', () => {
    test('should be defined', () => {
        expect(warmUpService).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof warmUpService).toBe('object' || 'function');
    });

    if (typeof warmUpService === 'object' && warmUpService !== null) {
        Object.keys(warmUpService).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof warmUpService[method]).toBe('function');
            });
        });
    }
});
