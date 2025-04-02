const { describe, test, expect, jest } = require('@jest/globals');
const projectService = require('../../src/services/projectService');



describe('services/projectService.js', () => {
    test('should be defined', () => {
        expect(projectService).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof projectService).toBe('object' || 'function');
    });

    if (typeof projectService === 'object' && projectService !== null) {
        Object.keys(projectService).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof projectService[method]).toBe('function');
            });
        });
    }
});
