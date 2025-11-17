import express from 'express';
import { getAllAlumnos, getAlumno, getAlumnoByMatricula, createAlumno, updateAlumno, deleteAlumno } from '../controllers/AlumnoController.js';

const router = express.Router();

router.get('/', getAllAlumnos);
router.get('/:id', getAlumno);
router.get('/matricula/:matricula', getAlumnoByMatricula); // Ruta para obtener un alumno por matricula
router.post('/', createAlumno);
router.put('/:id', updateAlumno);
router.delete('/:id', deleteAlumno);

export default router;