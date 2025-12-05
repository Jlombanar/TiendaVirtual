import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import Users from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
    
// FUNCIÓN PARA GENERAR CÓDIGO DE 6 DÍGITOS
const generarCodigo = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// 1. SOLICITAR CÓDIGO DE RECUPERACIÓN
export const solicitarCodigo = async (req, res) => {
    try {
        const { Correo_Electronico } = req.body;

        if (!Correo_Electronico) {
            return res.status(400).json({ 
                message: "El correo electrónico es obligatorio" 
            });
        }
        // Buscar usuario
        const usuario = await Users.findOne({ Correo_Electronico });

        if (!usuario) {
            return res.status(400).json({ 
                message: "Correo electronico no enocntrado " 
            });
        }

        // Generar código de 6 dígitos
        const codigo = generarCodigo();

        // Guardar código con expiración de 15 minutos
        usuario.codigoRecuperacion = codigo;
        usuario.codigoExpiracion = Date.now() + 900000; // 15 minutos
        await usuario.save();

        // Configurar email
        const mailOptions = {
            from: 'jalmpa77@gmail.com',
            to: usuario.Correo_Electronico,
            subject: 'Código de Recuperación - TechStore Pro',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #4F46E5; margin: 0;">TechStore Pro</h2>
                    </div>
                    
                    <h3 style="color: #333;">Recuperación de Contraseña</h3>
                    
                    <p>Hola <strong>${usuario.Nombre}</strong>,</p>
                    
                    <p>Recibimos una solicitud para restablecer tu contraseña.</p>
                    
                    <p>Tu código de verificación es:</p>
                    
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                                padding: 20px; 
                                border-radius: 10px; 
                                text-align: center; 
                                margin: 30px 0;">
                        <h1 style="color: black; 
                                   font-size: 36px; 
                                   letter-spacing: 8px; 
                                   margin: 0;
                                   font-family: monospace;">
                            ${codigo}
                        </h1>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">
                        ⏱️ Este código expirará en <strong>15 minutos</strong>.
                    </p>
                    
                    <p style="color: #666; font-size: 14px;">
                        🔒 Si no solicitaste este cambio, ignora este email y tu contraseña permanecerá segura.
                    </p>
                    
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                    
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        © 2025 TechStore Pro - Tu tienda de tecnología de confianza
                    </p>
                </div>
            `
        };

        // Enviar email
        await transporter.sendMail(mailOptions);

        console.log(`Código enviado a ${usuario.Correo_Electronico}: ${codigo}`);

        res.status(200).json({ 
            message: "Si el correo existe, recibirás un código de verificación",
            
        });

    } catch (error) {
        console.error("Error al enviar código:", error);
        res.status(500).json({
            message: "Error al procesar la solicitud",
            error: error.message
        });
    }
};

// 2. VERIFICAR CÓDIGO Y CAMBIAR CONTRASEÑA
export const cambiarPassword = async (req, res) => {
    try {
        const { Correo_Electronico, codigo, nuevaPassword } = req.body;

        // Validaciones
        if (!Correo_Electronico || !codigo || !nuevaPassword) {
            return res.status(400).json({ 
                message: "Todos los campos son obligatorios" 
            });
        }

        if (nuevaPassword.length < 6) {
            return res.status(400).json({ 
                message: "La contraseña debe tener al menos 6 caracteres" 
            });
        }

        // Buscar usuario
        const usuario = await Users.findOne({ 
            Correo_Electronico,
            codigoRecuperacion: codigo,
            codigoExpiracion: { $gt: Date.now() }
        });

        if (!usuario) {
            return res.status(400).json({ 
                message: "Código inválido o expirado" 
            });
        }

        // Encriptar nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(nuevaPassword, salt);

        // Actualizar contraseña y limpiar código
        usuario.passwords = hashedPassword;
        usuario.codigoRecuperacion = undefined;
        usuario.codigoExpiracion = undefined;
        await usuario.save();

        // Email de confirmación
        const mailOptions = {
            from: 'jalmpa77@gmail.com',
            to: usuario.Correo_Electronico,
            subject: 'Contraseña Actualizada - TechStore Pro',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                    width: 60px;
                                    height: 60px;
                                    border-radius: 50%;
                                    display: inline-flex;
                                    align-items: center;
                                    justify-content: center;
                                    margin-bottom: 20px;">
                            <span style="color: white; font-size: 30px;">✓</span>
                        </div>
                        <h2 style="color: #4F46E5; margin: 0;">Contraseña Actualizada</h2>
                    </div>
                    
                    <p>Hola <strong>${usuario.Nombre}</strong>,</p>
                    
                    <p>Tu contraseña ha sido actualizada exitosamente.</p>
                    
                    <p>Ya puedes iniciar sesión con tu nueva contraseña.</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                       <a href="http://127.0.0.1:5500/src/pages/login.html">
                           style="background: linear-gradient(to right, #4F46E5, #7C3AED); 
                                  color: white; 
                                  padding: 12px 30px; 
                                  text-decoration: none; 
                                  border-radius: 8px;
                                  display: inline-block;">
                            Iniciar Sesión
                        </a>
                    </div>
                    
                    <p style="color: #dc2626; font-size: 14px;">
                        ⚠️ Si no realizaste este cambio, contacta a soporte inmediatamente.
                    </p>
                    
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                    
                    <p style="color: #999; font-size: 12px; text-align: center;">
                        © 2025 TechStore Pro - Tu tienda de tecnología de confianza
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ 
            message: "Contraseña actualizada exitosamente" 
        });

    } catch (error) {
        console.error("Error al cambiar contraseña:", error);
        res.status(500).json({
            message: "Error al cambiar la contraseña",
            error: error.message
        });
    }
};
