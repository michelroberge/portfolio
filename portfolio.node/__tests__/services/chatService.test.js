const { describe, test, expect, jest } = require('@jest/globals');
const chatService = require('../../src/services/chatService');



describe('services/chatService.js', () => {
    test('should be defined', () => {
        expect(chatService).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof chatService).toBe('object' || 'function');
    });

    if (typeof chatService === 'object' && chatService !== null) {
        Object.keys(chatService).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof chatService[method]).toBe('function');
            });
        });
    }
});
