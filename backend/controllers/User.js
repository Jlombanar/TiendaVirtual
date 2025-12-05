import Users from "../models/User.js";
import bcrypt from "bcrypt";

// Creacion de los usuarios 

export const registrarUsers= async(req,res)=>{
    try {
        const {Nombre,Apellido,telefono,Correo_Electronico,passwords}=req.body;
        
        // validar que no falte ningun campo

        if (!Nombre || !Apellido || !telefono || !Correo_Electronico ||!passwords ){
            return res.status(400).json({message: "Todos los campos son obligatorio"});
        }
         // validad si el usuario ya existe
         const existeUsuario=await Users.findOne({Correo_Electronico});
         if(existeUsuario){
            return res.status(400).json({message:"Usuario ya esta registrado"});
         }

         // Encriptar la contraseña
         const saltRounds=10;
         const hashedPassword= await bcrypt.hash(passwords,saltRounds);
         // Crear el usuario en la base de datos
         const nuevoUsuario= new Users({Nombre,Apellido,telefono,Correo_Electronico,passwords:hashedPassword});
         await nuevoUsuario.save();
         res.status(201).json({message:"Usuario Registrado con exito"});
    } catch (error) {
        res.status(500).json({message:"Error al registrar Usuario",error:error.message});

    };
}


