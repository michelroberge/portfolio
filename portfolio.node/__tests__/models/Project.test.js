const { describe, test, expect, jest } = require('@jest/globals');
const Project = require('../../src/models/Project');



describe('models/Project.js', () => {
    test('should be defined', () => {
        expect(Project).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof Project).toBe('object' || 'function');
    });

    if (typeof Project === 'object' && Project !== null) {
        Object.keys(Project).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof Project[method]).toBe('function');
            });
        });
    }
});
