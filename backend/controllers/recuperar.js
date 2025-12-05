import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import Users from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

// CONFIGURACIÓN DE CORREO
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// GENERAR CÓDIGO DE 6 DÍGITOS
const generarCodigo = () => Math.floor(100000 + Math.random() * 900000).toString();


// ---------------------------------------------------------
// 1. SOLICITAR CÓDIGO DE RECUPERACIÓN
// ---------------------------------------------------------
export const solicitarCodigo = async (req, res) => {
    try {
        const { Correo_Electronico } = req.body;

        if (!Correo_Electronico) {
            return res.status(400).json({ message: "El correo electrónico es obligatorio" });
        }

        const usuario = await Users.findOne({ Correo_Electronico });

        if (!usuario) {
            return res.status(400).json({ message: "Correo electrónico no encontrado" });
        }

        const codigo = generarCodigo();

        usuario.codigoRecuperacion = codigo;
        usuario.codigoExpiracion = Date.now() + 900000;
        await usuario.save();

        // ENVIAR CORREO
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: usuario.Correo_Electronico,
            subject: "Código de Recuperación",
            html: `<h1>Tu código es: ${codigo}</h1>`
        });

        res.status(200).json({
            message: "Código enviado al correo registrado"
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: "Error al procesar la solicitud",
            error: error.message
        });
    }
};



// ---------------------------------------------------------
// 2. CAMBIAR CONTRASEÑA
// ---------------------------------------------------------
export const cambiarPassword = async (req, res) => {
    try {
        const { Correo_Electronico, codigo, nuevaPassword } = req.body;

        if (!Correo_Electronico || !codigo || !nuevaPassword) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const usuario = await Users.findOne({
            Correo_Electronico,
            codigoRecuperacion: codigo,
            codigoExpiracion: { $gt: Date.now() }
        });

        if (!usuario) {
            return res.status(400).json({ message: "Código inválido o expirado" });
        }

        const hashed = await bcrypt.hash(nuevaPassword, 10);

        usuario.passwords = hashed;
        usuario.codigoRecuperacion = undefined;
        usuario.codigoExpiracion = undefined;
        await usuario.save();

        res.status(200).json({
            message: "Contraseña cambiada exitosamente"
        });

    } catch (error) {
        console.error("Error al cambiar contraseña:", error);
        res.status(500).json({
            message: "Error al cambiar contraseña",
            error: error.message
        });
    }
};
