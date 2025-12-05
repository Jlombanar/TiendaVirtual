import bcrypt from "bcrypt";
import Users from "../models/User.js";

export const LoginUsuario=async(req,res)=>{
    try {
        const {Correo_Electronico,passwords}=req.body;
        
        // validamos los campos esten presentes
        if(!Correo_Electronico|| !passwords){
            return res.status(400).json({message: "Correo y contraseña obligstorios"});
        }
        // buscamos el usuario en la base de datos. 

        const usuario = await Users.findOne({Correo_Electronico});
        if(!usuario){
            return res.status(404).json({message:"usuario no encontrado"});
        }
        // comparamos la contraseña encryptada  en la bs

        const passwordsValida= await bcrypt.compare(passwords,usuario.passwords)
        if (!passwordsValida){
            return res.status(401).json({message:"contraseña incorrecta"});
        }
        // validamos el inciio de sesion exitoso
        res.status(200).json({
            message:" Inicio de sesion correcto",
            usuario:{
                id: usuario._id,
                nombre: usuario.Nombre,
                apellido: usuario.Apellido,
                email: usuario.Correo_Electronico,
                Telefono: usuario.telefono
            }
            
        });

    } catch (error) {
        res.status(500).json({message:"error al inicar sesion",error:error.message});
    };
}