const { describe, test, expect, jest } = require('@jest/globals');
const promptService = require('../../src/services/promptService');



describe('services/promptService.js', () => {
    test('should be defined', () => {
        expect(promptService).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof promptService).toBe('object' || 'function');
    });

    if (typeof promptService === 'object' && promptService !== null) {
        Object.keys(promptService).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof promptService[method]).toBe('function');
            });
        });
    }
});
