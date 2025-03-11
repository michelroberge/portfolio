const { describe, test, expect, jest } = require('@jest/globals');
const admin = require('../../src/middlewares/admin');



describe('middlewares/admin.js', () => {
    test('should be defined', () => {
        expect(admin).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof admin).toBe('object' || 'function');
    });

    if (typeof admin === 'object' && admin !== null) {
        Object.keys(admin).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof admin[method]).toBe('function');
            });
        });
    }
});
