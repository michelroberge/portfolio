const { describe, test, expect, jest } = require('@jest/globals');
const Prompt = require('../../src/models/Prompt');



describe('models/Prompt.js', () => {
    test('should be defined', () => {
        expect(Prompt).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof Prompt).toBe('object' || 'function');
    });

    if (typeof Prompt === 'object' && Prompt !== null) {
        Object.keys(Prompt).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof Prompt[method]).toBe('function');
            });
        });
    }
});
