const { describe, test, expect, jest } = require('@jest/globals');
const wsChatService = require('../../src/services/wsChatService');



describe('services/wsChatService.js', () => {
    test('should be defined', () => {
        expect(wsChatService).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof wsChatService).toBe('object' || 'function');
    });

    if (typeof wsChatService === 'object' && wsChatService !== null) {
        Object.keys(wsChatService).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof wsChatService[method]).toBe('function');
            });
        });
    }
});
