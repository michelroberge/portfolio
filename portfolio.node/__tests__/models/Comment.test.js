const { describe, test, expect, jest } = require('@jest/globals');
const Comment = require('../../src/models/Comment');



describe('models/Comment.js', () => {
    test('should be defined', () => {
        expect(Comment).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof Comment).toBe('object' || 'function');
    });

    if (typeof Comment === 'object' && Comment !== null) {
        Object.keys(Comment).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof Comment[method]).toBe('function');
            });
        });
    }
});
