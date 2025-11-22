import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import AlumnoRoutes from './routes/AlumnoRoutes.js';
import ContactoRoutes from './routes/ContactoRoutes.js';
import GrupoRoutes from './routes/GrupoRoutes.js';
import TestVarkRoutes from './routes/TestVarkRoutes.js';
import TestPersonalidadRoutes from './routes/TestPersonalidadRoutes.js';
import { testConnection } from './models/database.js';
import DashboardRoutes from './routes/DashboardRoutes.js';
import AuthRoutes from './routes/AuthRoutes.js';
import { requireAuthView } from './middleware/auth.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar sesión
app.use(session({
    secret: process.env.SESSION_SECRET || 'tu-secreto-de-sesion-cambiar-en-produccion',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Cambiar a true en producción con HTTPS
        httpOnly: true,
        maxAge: 8 * 60 * 60 * 1000 // 8 horas
    }
}));

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Para CSS/JS/imágenes

// API Routes
app.use('/api/alumnos', AlumnoRoutes);
app.use('/api/contactos', ContactoRoutes);
app.use('/api/grupos', GrupoRoutes);
app.use('/api/tests/vark', TestVarkRoutes);
app.use('/api/tests/personalidad', TestPersonalidadRoutes);
app.use('/api/dashboard', DashboardRoutes);
app.use('/api/auth', AuthRoutes);

// Rutas de vistas
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/test-vark', async (req, res) => {
  // Obtener grupos para el selector
  const { Grupos } = await import('./models/database.js');
  const grupos = await Grupos.findAll({ where: { activo: true } });
  res.render('vark-test', { grupos });
});

app.get('/test-personalidad', async (req, res) => {
  const { Grupos } = await import('./models/database.js');
  const grupos = await Grupos.findAll({ where: { activo: true } });
  res.render('personalidad-test', { grupos });
});

app.get('/admin/login', (req, res) => {
    res.render('login', { error: null });
});

app.get('/admin/AdminPage', requireAuthView, (req, res) => {
    res.render('admin/AdminPage');
})

app.get('/admin/Catalogos', (req, res) => {
    res.render('admin/catalogos');
})

// Test DB connection
await testConnection();

app.listen(PORT, () => console.log(`✅ Servidor escuchando en http://localhost:${PORT}`));