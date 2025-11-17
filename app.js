import express from 'express';
import AlumnoRoutes from './routes/AlumnoRoutes.js';
import ContactoRoutes from './routes/ContactoRoutes.js';
import GrupoRoutes from './routes/GrupoRoutes.js';
import { testConnection } from './models/database.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/alumnos', AlumnoRoutes);
app.use('/contactos', ContactoRoutes);
app.use('/grupos', GrupoRoutes);

// Test DB connection before starting server
await testConnection();

app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));