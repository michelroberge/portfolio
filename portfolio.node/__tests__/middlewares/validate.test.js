const { describe, test, expect, jest } = require('@jest/globals');
const validate = require('../../src/middlewares/validate');



describe('middlewares/validate.js', () => {
    test('should be defined', () => {
        expect(validate).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof validate).toBe('object' || 'function');
    });

    if (typeof validate === 'object' && validate !== null) {
        Object.keys(validate).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof validate[method]).toBe('function');
            });
        });
    }
});
