import express from 'express';
import { fetchTalent } from '../controllers/clientController.js';
const router=express.Router();

router.get('/searchTalent',fetchTalent);

export default router;