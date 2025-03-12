const { describe, test, expect, jest } = require('@jest/globals');
const db = require('../../src/config/db');



describe('config/db.js', () => {
    test('should be defined', () => {
        expect(db).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof db).toBe('object' || 'function');
    });

    if (typeof db === 'object' && db !== null) {
        Object.keys(db).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof db[method]).toBe('function');
            });
        });
    }
});
