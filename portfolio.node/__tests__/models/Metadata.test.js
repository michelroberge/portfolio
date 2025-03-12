const { describe, test, expect, jest } = require('@jest/globals');
const Metadata = require('../../src/models/Metadata');



describe('models/Metadata.js', () => {
    test('should be defined', () => {
        expect(Metadata).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof Metadata).toBe('object' || 'function');
    });

    if (typeof Metadata === 'object' && Metadata !== null) {
        Object.keys(Metadata).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof Metadata[method]).toBe('function');
            });
        });
    }
});
