// portfolio.node/src/tracing.js
'use strict';

const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

// Configure the OTLP Trace Exporter.
const traceExporter = new OTLPTraceExporter({
  // Configure the exporter URL if needed.
});

// Create the NodeSDK instance.
const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

// Start the SDK.
const startResult = sdk.start();
if (startResult && typeof startResult.then === 'function') {
  startResult
    .then(() => {
      console.log('Tracing initialized');
    })
    .catch((error) => {
      console.error('Error initializing tracing', error);
    });
} else {
  // If start() is synchronous.
  console.log('Tracing initialized (synchronously)');
}

// Handle graceful shutdown.
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});
