const { describe, test, expect, jest } = require('@jest/globals');
const blogValidator = require('../../src/validators/blogValidator');



describe('validators/blogValidator.js', () => {
    test('should be defined', () => {
        expect(blogValidator).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof blogValidator).toBe('object' || 'function');
    });

    if (typeof blogValidator === 'object' && blogValidator !== null) {
        Object.keys(blogValidator).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof blogValidator[method]).toBe('function');
            });
        });
    }
});
