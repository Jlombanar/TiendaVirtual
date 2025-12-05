// importamos el modelo de la base de datos 
import Users from "../models/User.js"

// obtener perfil de lal usuario de la base de datos 

export const obtenerPerfil = async (req,res) => {
    try {
        const { email } =req.body;
        if(!email){
            return res.status(400).json({message:"Email es requerido"});
        
        }
        // traer el correo del usuario 

        const usuario = await Users.findOne({Correo_Electronico:email}).select('-passwords');
        if(!usuario){
            return res.status(400).json({message:" Usuario no encontrado"});

        }
        res. status(200).json({
            usuario:{
                id: usuario._id,
                nombre: usuario.Nombre,
                apellido: usuario.Apellido,
                email: usuario.Correo_Electronico,
                Telefono: usuario.telefono

            }
        })

    } catch (error) {
        res.status(500).json({
            message:" Error al obtener el Perfil", error: error.message
        });
    }
}


// Actualizar usuario 

// Actualizar perfil del usuario
export const actualizarPerfil = async (req, res) => {
    try {
        const { email, nombre, apellido, telefono } = req.body;

        // Validar campos obligatorios
        if (!email) {
            return res.status(400).json({ message: "Email es requerido" });
        }

        if (!nombre || !apellido || !telefono) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }
        // Buscar y actualizar usuario
        const usuarioActualizado = await Users.findOneAndUpdate(
            { Correo_Electronico: email },
            { 
                Nombre: nombre,
                Apellido: apellido,
                Telefono: telefono
            },
            { new: true }
            // no va seleccionar el campo passwords
        ).select('-passwords');

        if (!usuarioActualizado) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({
            message: "Perfil actualizado exitosamente",
            usuario: {
                id: usuarioActualizado._id,
                nombre: usuarioActualizado.Nombre,
                apellido: usuarioActualizado.Apellido,
                email: usuarioActualizado.Correo_Electronico,
                telefono: usuarioActualizado.Telefono
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error al actualizar perfil", 
            error: error.message 
        });
    }
};

// Eliminar perfil del usuario
export const eliminarPerfil = async (req, res) => {
    try {
        const { email } = req.body;

        // Validar que el email esté presente
        if (!email) {
            return res.status(400).json({ message: "Email es requerido" });
        }

        // Buscar y eliminar usuario
        const usuarioEliminado = await Users.findOneAndDelete({ 
            Correo_Electronico: email 
        });

        if (!usuarioEliminado) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({
            message: "Usuario eliminado exitosamente",
            usuario: {
                id: usuarioEliminado._id,
                nombre: usuarioEliminado.Nombre,
                apellido: usuarioEliminado.Apellido,
                email: usuarioEliminado.Correo_Electronico
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error al eliminar perfil", 
            error: error.message 
        });
    }
};

