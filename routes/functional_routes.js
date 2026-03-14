import { Router } from "express";
import * as metricData from "../data/core_functions.js";

const router = Router()

router
  .route('/sync')
  .get(async (req, res) => {
    try{
      if(req.user.role !== 'super admin' || !req.user){
        return res.status(403).json({ error: "Forbidden" });
      }

      const user = await metricData.snapraidSync();

      return res.status(200).json( user )
      
    } catch (e) {
      return res.status(400).json({ error: e }) 
    }
  });

router
  .route('/scrub')
  .get(async (req, res) => {
    try{
      if(req.user.role !== 'super admin' || !req.user){
        return res.status(403).json({ error: "Forbidden" });
      }

      const user = await metricData.snapraidScrub(req.query.p || 8, req.query.o || 10);

      return res.status(200).json( user )
      
    } catch (e) {
      return res.status(400).json({ error: e }) 
    }
  });

router
  .route('/status')
  .get(async (req, res) => {
    try{
      if(req.user.role !== 'super admin' || !req.user){
        return res.status(403).json({ error: "Forbidden" });
      }


      const user = await metricData.snapraidStatus();

      return res.status(200).json( user )
      
    } catch (e) {
      return res.status(400).json({ error: e }) 
    }
  });




export default router;