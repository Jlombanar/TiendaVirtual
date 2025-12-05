import Productos from "../models/Productos.js";

// Crear producto
export const crearProducto= async(req,res)=>{
      try {
        const{productId,Nombre,Descripcion,Precio,Image}=req.body;
        const newProduct=new Productos({
           productId,
           Nombre,
           Descripcion,
           Precio,
           Image
        });
        await newProduct.save();
        res.status(201).json({mesagge:"producto guardado con exito"});
    } catch (error) {
        console.error("Error al guardar el producto", error);
        res.status(400).json({
            mesagge: " Error al ingresar el producto"
        });
        
    }
};

// traer los datos de la base de datos
export const obtenerProductos=async (req,res)=>{
   try {
     const listarproductos =await Productos.find();
    res.json(listarproductos);
   } catch (error) {
    res.status(500).json({mesagge:"Error al obtener los productos"});
   }
}

