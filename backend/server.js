import express from 'express';
import cors from 'cors';
import "./db/db.js";
import ProductosRoute from "./routes/Productos.js";
import UsersRoutes from "./routes/Users.js";
import  loginUsuarioRouter from './routes/Login.js';
import obtenerPerfil  from './routes/Perfil.js';
import pedidosRoutes from './routes/pedidos.js';
import RecuperarPassword from './routes/recuperar.js'


const app =express();
app.use(express.json());
// habilitar toda sla rutas 
app.use(cors());
// primera ruta

app.get('/',(req,res)=>{
    res.send('Bienvenido al curso de node exprees');
});
// Api de producto
app.use("/api/productos",ProductosRoute);
app.use("/api/users",UsersRoutes);
app.use("/api/login", loginUsuarioRouter);
app.use("/api/perfil", obtenerPerfil);
app.use("/api/pedidos", pedidosRoutes);
app.use('/api/Recuperar',RecuperarPassword)




app.listen(8081,()=> console.log('servidor corriendo en http://localhost:8081'));
