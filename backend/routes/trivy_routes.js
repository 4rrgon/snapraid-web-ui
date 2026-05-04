import { Router } from 'express';
import { scanProject } from '../data/trivy.js';

const router = Router();

router.get('/project', async (req, res) => {
  try {
    const report = await scanProject('/app');
    res.json(report);
  } catch (e) {
    res.status(500).json({ error: e?.message || String(e) });
  }
});

export default router;