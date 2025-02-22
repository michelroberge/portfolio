describe('Environment Variables', () => {
    it('should load MONGO_URI from .env.test', () => {
      expect(process.env.MONGO_URI).toBeDefined();
      // Optionally, you can check for a specific value
      expect(process.env.MONGO_URI).toBe('mongodb://10.0.0.151:27017/portfolio-test');
    });
  });