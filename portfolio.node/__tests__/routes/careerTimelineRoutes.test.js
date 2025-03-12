const { describe, test, expect, jest } = require('@jest/globals');
const careerTimelineRoutes = require('../../src/routes/careerTimelineRoutes');


jest.mock('../../src/middlewares/auth', () => (req, res, next) => next());
jest.mock('../../src/middlewares/admin', () => (req, res, next) => next());


describe('routes/careerTimelineRoutes.js', () => {
    test('should be defined', () => {
        expect(careerTimelineRoutes).toBeDefined();
    });

    test('should have expected methods and properties', () => {
        expect(typeof careerTimelineRoutes).toBe('object' || 'function');
    });

    if (typeof careerTimelineRoutes === 'object' && careerTimelineRoutes !== null) {
        Object.keys(careerTimelineRoutes).forEach(method => {
            test(`method ${method} should be defined`, () => {
                expect(typeof careerTimelineRoutes[method]).toBe('function');
            });
        });
    }
});
