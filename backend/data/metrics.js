import client from 'prom-client';

if (!globalThis.__promMetricsInitialized) {
  client.collectDefaultMetrics();
  globalThis.__promMetricsInitialized = true;
}

export const snapraidActionRuns = new client.Counter({
  name: 'snapraid_action_runs_total',
  help: 'Total SnapRAID actions run',
  labelNames: ['action', 'result'],
});

export const snapraidActionDuration = new client.Histogram({
  name: 'snapraid_action_duration_seconds',
  help: 'Duration of SnapRAID actions',
  labelNames: ['action'],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60, 120, 300],
});

export const snapraidActionRunning = new client.Gauge({
  name: 'snapraid_action_running',
  help: 'Number of SnapRAID actions currently running',
  labelNames: ['action'],
});

export const snapraidLastRunTimestamp = new client.Gauge({
  name: 'snapraid_last_run_timestamp_seconds',
  help: 'Unix timestamp of the last completed SnapRAID action',
  labelNames: ['action'],
});

export const snapraidLastSuccessTimestamp = new client.Gauge({
  name: 'snapraid_last_success_timestamp_seconds',
  help: 'Unix timestamp of the last successful SnapRAID action',
  labelNames: ['action'],
});

export const metricsHandler = async (_req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.send(await client.register.metrics());
};

export async function observeAction(action, fn) {
  snapraidActionRunning.labels(action).inc();
  const endTimer = snapraidActionDuration.labels(action).startTimer();

  try {
    const result = await fn();
    snapraidActionRuns.labels(action, 'success').inc();
    snapraidLastSuccessTimestamp.labels(action).set(Date.now());
    return result;
  } catch (err) {
    snapraidActionRuns.labels(action, 'error').inc();
    throw err;
  } finally {
    endTimer();
    snapraidActionRunning.labels(action).dec();
    snapraidLastRunTimestamp.labels(action).set(Date.now());
  }
}