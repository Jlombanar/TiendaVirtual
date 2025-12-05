import express from 'express';
import cors from 'cors';
import "./db/db.js";
import ProductosRoute from "./routes/Productos.js";
import UsersRoutes from "./routes/Users.js";
import loginUsuarioRouter from './routes/Login.js';
import obtenerPerfil from './routes/Perfil.js';
import pedidosRoutes from './routes/pedidos.js';
import RecuperarPassword from './routes/recuperar.js';

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: [
    'https://tiendajimmy.netlify.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Primera ruta
app.get('/', (req, res) => {
  res.send('Bienvenido al curso de node exprees');
});

// Api de producto
app.use("/api/productos", ProductosRoute);
app.use("/api/users", UsersRoutes);
app.use("/api/login", loginUsuarioRouter);
app.use("/api/perfil", obtenerPerfil);
app.use("/api/pedidos", pedidosRoutes);
app.use('/api/Recuperar', RecuperarPassword);

// Puerto dinámico para Render
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
