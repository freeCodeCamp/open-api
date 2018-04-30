// Add source map support for proper stack traces
import 'source-map-support/register';

// Catch all unhandled exceptions and print their stack trace.
// Required if the handler function is async, as promises
// can swallow error messages.
process.on('unhandledRejection', e => {
  console.error(e.stack);
  /* eslint-disable no-process-exit */
  process.exit(1);
  /* eslint-enable no-process-exit */
});
