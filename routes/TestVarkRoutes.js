import express from 'express';
import { 
  getAllTestsVark, 
  getTestVark, 
  getTestsVarkByAlumno,
  createTestVark, 
  updateTestVark, 
  deleteTestVark 
} from '../controllers/TestVarkController.js';

const router = express.Router();

router.get('/', getAllTestsVark);
router.get('/:id', getTestVark);
router.get('/alumno/:idAlumno', getTestsVarkByAlumno);
router.post('/', createTestVark);
router.put('/:id', updateTestVark);
router.delete('/:id', deleteTestVark);

export default router;