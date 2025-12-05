import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import Users from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

// Verificar que existan las variables de entorno
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ ERROR: EMAIL_USER o EMAIL_PASS no están configurados');
}

// CONFIGURACIÓN DE CORREO
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
});

// Verificar la conexión del transportador
transporter.verify(function(error, success) {
    if (error) {
        console.error('❌ Error en configuración de email:', error);
    } else {
        console.log('✅ Servidor de email listo para enviar mensajes');
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

        console.log('📧 Solicitud de código para:', Correo_Electronico);

        if (!Correo_Electronico) {
            return res.status(400).json({ message: "El correo electrónico es obligatorio" });
        }

        const usuario = await Users.findOne({ Correo_Electronico });

        if (!usuario) {
            return res.status(400).json({ message: "Correo electrónico no encontrado" });
        }

        const codigo = generarCodigo();

        usuario.codigoRecuperacion = codigo;
        usuario.codigoExpiracion = Date.now() + 900000; // 15 minutos
        await usuario.save();

        console.log('💾 Código guardado en BD:', codigo);

        // ENVIAR CORREO
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: usuario.Correo_Electronico,
            subject: "Código de Recuperación",
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
                        <h1 style="color: #2563eb;">TechStore Pro</h1>
                        <h2 style="color: #333;">Código de Recuperación</h2>
                        <p>Has solicitado recuperar tu contraseña.</p>
                        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
                            <h1 style="color: #2563eb; font-size: 36px; letter-spacing: 5px;">${codigo}</h1>
                        </div>
                        <p style="color: #666;">Este código expirará en 15 minutos.</p>
                        <p style="color: #666;">Si no solicitaste este código, ignora este mensaje.</p>
                    </div>
                </div>
            `
        });

        console.log('✅ Email enviado:', info.messageId);

        res.status(200).json({
            message: "Código enviado al correo registrado"
        });

    } catch (error) {
        console.error("❌ Error completo:", error);
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

        console.log('🔐 Intentando cambiar contraseña para:', Correo_Electronico);

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

        console.log('✅ Contraseña actualizada exitosamente');

        res.status(200).json({
            message: "Contraseña cambiada exitosamente"
        });

    } catch (error) {
        console.error("❌ Error al cambiar contraseña:", error);
        res.status(500).json({
            message: "Error al cambiar contraseña",
            error: error.message
        });
    }
};