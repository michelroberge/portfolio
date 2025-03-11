const { describe, test, expect, jest } = require('@jest/globals');
const blogService = require('../../src/services/blogService');



describe('services/blogService.js', () => {
    test('should be defined', () => {
        expect(blogService).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof blogService).toBe('object' || 'function');
    });

    if (typeof blogService === 'object' && blogService !== null) {
        Object.keys(blogService).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof blogService[method]).toBe('function');
            });
        });
    }
});
