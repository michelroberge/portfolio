const { describe, test, expect, jest } = require('@jest/globals');
const server = require('../../src/server');



describe('server.js', () => {
    test('should be defined', () => {
        expect(server).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof server).toBe('object' || 'function');
    });

    if (typeof server === 'object' && server !== null) {
        Object.keys(server).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof server[method]).toBe('function');
            });
        });
    }
});
