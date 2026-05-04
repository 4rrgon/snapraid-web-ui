import { Router } from 'express';
import { scanProject, scanImage } from '../data/trivy.js';

const router = Router();

router.get('/project', async (req, res) => {
  try {
    const report = await scanProject('/srv/app');
    res.json(report);
  } catch (e) {
    res.status(500).json({ error: e?.message || String(e) });
  }
});

router.get('/image', async (req, res) => {
  try {
    const report = await scanImage('my-dashboard:latest');
    res.json(report);
  } catch (e) {
    res.status(500).json({ error: e?.message || String(e) });
  }
});

export default router;