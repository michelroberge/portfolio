const generatePrompt = require('../../src/utils/generatePrompt');



describe('utils/generatePrompt.js', () => {
    test('should be defined', () => {
        expect(generatePrompt).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof generatePrompt).toBe('object' || 'function');
    });

    if (typeof generatePrompt === 'object' && generatePrompt !== null) {
        Object.keys(generatePrompt).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof generatePrompt[method]).toBe('function');
            });
        });
    }
});
