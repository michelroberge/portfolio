const { describe, test, expect, jest } = require('@jest/globals');
const Page = require('../../src/models/Page');



describe('models/Page.js', () => {
    test('should be defined', () => {
        expect(Page).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof Page).toBe('object' || 'function');
    });

    if (typeof Page === 'object' && Page !== null) {
        Object.keys(Page).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof Page[method]).toBe('function');
            });
        });
    }
});
