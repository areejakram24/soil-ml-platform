import express from 'express';
import authenticateToken from '../middleware/auth.js';
import {
  createAnalysis,
  getAnalyses,
  getAnalysisById,
  updateAnalysis,
  deleteAnalysis
} from '../controllers/soilAnalysisController.js';

const router = express.Router();

router.post('/', authenticateToken, createAnalysis);
router.get('/', authenticateToken, getAnalyses);
router.get('/:id', authenticateToken, getAnalysisById);
router.put('/:id', authenticateToken, updateAnalysis);
router.delete('/:id', authenticateToken, deleteAnalysis);

export default router;