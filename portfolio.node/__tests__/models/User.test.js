const { describe, test, expect, jest } = require('@jest/globals');
const User = require('../../src/models/User');



describe('models/User.js', () => {
    test('should be defined', () => {
        expect(User).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof User).toBe('object' || 'function');
    });

    if (typeof User === 'object' && User !== null) {
        Object.keys(User).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof User[method]).toBe('function');
            });
        });
    }
});
