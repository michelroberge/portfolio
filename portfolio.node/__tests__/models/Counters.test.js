const { describe, test, expect, jest } = require('@jest/globals');
const Counters = require('../../src/models/Counters');



describe('models/Counters.js', () => {
    test('should be defined', () => {
        expect(Counters).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof Counters).toBe('object' || 'function');
    });

    if (typeof Counters === 'object' && Counters !== null) {
        Object.keys(Counters).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof Counters[method]).toBe('function');
            });
        });
    }
});
