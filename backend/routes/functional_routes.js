import { Router } from 'express';
import * as metricData from '../data/core_functions.js';
import { observeAction } from '../data/metrics.js';

const router = Router();

const requireAdmin = (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }

  if (req.user.role !== 'super admin') {
    res.status(403).json({ error: 'Forbidden' });
    return false;
  }

  return true;
};

router.get('/sync/:prehash?', async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    const prehash = String(req.params.prehash).toLowerCase() === 'true';

    const output = await observeAction('sync', () =>
      metricData.snapraidSync(prehash)
    );

    return res.status(200).json({ output });
  } catch (e) {
    return res.status(400).json({ error: e?.message || String(e) });
  }
});

router.get('/scrub/:percentage?/:older?', async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    const percentage = Number.parseInt(req.params.percentage ?? '8', 10);
    const older = Number.parseInt(req.params.older ?? '10', 10);

    const output = await observeAction('scrub', () =>
      metricData.snapraidScrub(percentage, older)
    );

    return res.status(200).json({ output });
  } catch (e) {
    return res.status(400).json({ error: e?.message || String(e) });
  }
});

router.get('/status', async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    const output = await observeAction('status', () =>
      metricData.snapraidStatus()
    );

    return res.status(200).json({ output });
  } catch (e) {
    return res.status(400).json({ error: e?.message || String(e) });
  }
});

router.get('/check', async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    const output = await observeAction('check', () =>
      metricData.snapraidCheck()
    );

    return res.status(200).json({ output });
  } catch (e) {
    return res.status(400).json({ error: e?.message || String(e) });
  }
});

router.get('/smart', async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    const output = await observeAction('smart', () =>
      metricData.snapraidSmart()
    );

    return res.status(200).json({ output });
  } catch (e) {
    return res.status(400).json({ error: e?.message || String(e) });
  }
});



export default router;

