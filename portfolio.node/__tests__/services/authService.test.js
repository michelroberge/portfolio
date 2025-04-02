const { describe, test, expect, jest } = require('@jest/globals');
const authService = require('../../src/services/authService');



describe('services/authService.js', () => {
    test('should be defined', () => {
        expect(authService).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof authService).toBe('object' || 'function');
    });

    if (typeof authService === 'object' && authService !== null) {
        Object.keys(authService).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof authService[method]).toBe('function');
            });
        });
    }
});
