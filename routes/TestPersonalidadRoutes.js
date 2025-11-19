import express from 'express';
import { 
  getAllTestsPersonalidad, 
  getTestPersonalidad, 
  getTestsPersonalidadByAlumno,
  createTestPersonalidad, 
  updateTestPersonalidad, 
  deleteTestPersonalidad 
} from '../controllers/TestPersonalidadController.js';

const router = express.Router();

router.get('/', getAllTestsPersonalidad);
router.get('/:id', getTestPersonalidad);
router.get('/alumno/:idAlumno', getTestsPersonalidadByAlumno);
router.post('/', createTestPersonalidad);
router.put('/:id', updateTestPersonalidad);
router.delete('/:id', deleteTestPersonalidad);

export default router;