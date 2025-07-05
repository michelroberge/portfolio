const commentService = require('../../src/services/commentService');



describe('services/commentService.js', () => {
    test('should be defined', () => {
        expect(commentService).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof commentService).toBe('object' || 'function');
    });

    if (typeof commentService === 'object' && commentService !== null) {
        Object.keys(commentService).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof commentService[method]).toBe('function');
            });
        });
    }
});
