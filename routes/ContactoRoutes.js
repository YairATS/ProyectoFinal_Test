import express from 'express';
import { getAllContactos, getContacto, createContacto, updateContacto, deleteContacto } from '../controllers/ContactoController.js';

const router = express.Router();

router.get('/', getAllContactos);
router.get('/:id', getContacto);
router.post('/', createContacto);
router.put('/:id', updateContacto);
router.delete('/:id', deleteContacto);

export default router;