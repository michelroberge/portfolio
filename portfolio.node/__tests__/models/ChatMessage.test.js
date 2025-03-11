const { describe, test, expect, jest } = require('@jest/globals');
const ChatMessage = require('../../src/models/ChatMessage');



describe('models/ChatMessage.js', () => {
    test('should be defined', () => {
        expect(ChatMessage).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof ChatMessage).toBe('object' || 'function');
    });

    if (typeof ChatMessage === 'object' && ChatMessage !== null) {
        Object.keys(ChatMessage).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof ChatMessage[method]).toBe('function');
            });
        });
    }
});
