import express  from "express";
import { crearProducto ,obtenerProductos} from "../controllers/Productos.js";

const router=express.Router();

// ruta para crear producto
router.post("/",crearProducto);
 // Ruta para obtener todos los productos

 router.get("/",obtenerProductos);

 export default router;