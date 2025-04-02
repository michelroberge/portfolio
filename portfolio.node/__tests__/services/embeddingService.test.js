const { describe, test, expect, jest } = require('@jest/globals');
const embeddingService = require('../../src/services/embeddingService');



describe('services/embeddingService.js', () => {
    test('should be defined', () => {
        expect(embeddingService).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof embeddingService).toBe('object' || 'function');
    });

    if (typeof embeddingService === 'object' && embeddingService !== null) {
        Object.keys(embeddingService).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof embeddingService[method]).toBe('function');
            });
        });
    }
});
