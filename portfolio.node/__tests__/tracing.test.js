const { describe, test, expect, jest } = require('@jest/globals');
const tracing = require('../../src/tracing');



describe('tracing.js', () => {
    test('should be defined', () => {
        expect(tracing).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof tracing).toBe('object' || 'function');
    });

    if (typeof tracing === 'object' && tracing !== null) {
        Object.keys(tracing).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof tracing[method]).toBe('function');
            });
        });
    }
});
