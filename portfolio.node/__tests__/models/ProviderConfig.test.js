const { describe, test, expect, jest } = require('@jest/globals');
const ProviderConfig = require('../../src/models/ProviderConfig');



describe('models/ProviderConfig.js', () => {
    test('should be defined', () => {
        expect(ProviderConfig).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof ProviderConfig).toBe('object' || 'function');
    });

    if (typeof ProviderConfig === 'object' && ProviderConfig !== null) {
        Object.keys(ProviderConfig).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof ProviderConfig[method]).toBe('function');
            });
        });
    }
});
