// portfolio.node/src/middleware/metrics.js
'use strict';

const opentelemetry = require('@opentelemetry/api');

// Get a meter instance; the name can be anything that identifies your service.
const meter = opentelemetry.metrics.getMeter('portfolio-node');

// Create a histogram metric to record request durations (in seconds).
const requestDurationHistogram = meter.createHistogram('http_request_duration_seconds', {
  description: 'Duration of HTTP requests in seconds',
  // Optional: define bucket boundaries if desired
  boundaries: [0.1, 0.5, 1, 2, 5, 10],
});

module.exports = function metricsMiddleware(req, res, next) {
  // Record the start time using high-resolution timer.
  const start = process.hrtime();
  
  // When the response is finished, calculate duration and record metric.
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationSeconds = diff[0] + diff[1] / 1e9; // seconds

    // Record the duration along with labels to distinguish endpoints.
    requestDurationHistogram.record(durationSeconds, {
      route: req.route ? req.route.path : req.path,
      method: req.method,
      statusCode: res.statusCode,
    });
  });
  
  next();
};
