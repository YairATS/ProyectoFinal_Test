import express from 'express';
import { getAllGrupos, getGrupo, createGrupo, updateGrupo, deleteGrupo } from '../controllers/GrupoController.js';

const router = express.Router();

router.get('/', getAllGrupos);
router.get('/:id', getGrupo);
router.post('/', createGrupo);
router.put('/:id', updateGrupo);
router.delete('/:id', deleteGrupo);

export default router;