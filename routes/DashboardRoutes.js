import express from 'express';
import { 
  getEstadisticasVarkGrupo, 
  getEstadisticasPersonalidadGrupo 
} from '../controllers/DashboardController.js';

const router = express.Router();

router.get('/vark/grupo/:idGrupo', getEstadisticasVarkGrupo);
router.get('/personalidad/grupo/:idGrupo', getEstadisticasPersonalidadGrupo);

export default router;