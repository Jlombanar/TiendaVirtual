import bcrypt from "bcrypt";
import axios from "axios";
import Users from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

// -------------------------------
// GENERAR CÓDIGO DE 6 DÍGITOS
// -------------------------------
const generarCodigo = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// -------------------------------
// ENVIAR CORREO CON MAILERSEND
// -------------------------------
const enviarCorreo = async (destinatario, codigo) => {
  try {
    const API_KEY = process.env.MAILERSEND_API_KEY;
    const FROM_EMAIL = process.env.MAILERSEND_FROM;

    const response = await axios.post(
      "https://api.mailersend.com/v1/email",
      {
        from: { email: FROM_EMAIL },
        to: [{ email: destinatario }],
        subject: "Código de Recuperación",
        html: `
          <div style="font-family: Arial; padding: 20px;">
            <h2>Recuperación de contraseña</h2>
            <p>Tu código de recuperación es:</p>
            <h1 style="color: #2563eb; font-size: 40px;">${codigo}</h1>
            <p>Este código expira en 15 minutos.</p>
          </div>
        `
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return true;
  } catch (err) {
    console.error("❌ Error enviando correo:", err.response?.data || err);
    return false;
  }
};

// ---------------------------------------------------------
// 1. SOLICITAR CÓDIGO DE RECUPERACIÓN
// ---------------------------------------------------------
export const solicitarCodigo = async (req, res) => {
  try {
    const { Correo_Electronico } = req.body;

    if (!Correo_Electronico) {
      return res.status(400).json({ message: "El correo es obligatorio" });
    }

    const usuario = await Users.findOne({ Correo_Electronico });

    if (!usuario) {
      return res.status(400).json({ message: "Correo no registrado" });
    }

    const codigo = generarCodigo();

    usuario.codigoRecuperacion = codigo;
    usuario.codigoExpiracion = Date.now() + 15 * 60 * 1000; // Expira en 15 minutos
    await usuario.save();

    const enviado = await enviarCorreo(Correo_Electronico, codigo);

    if (!enviado) {
      return res.status(500).json({
        message: "No se pudo enviar el correo"
      });
    }

    res.json({
      message: "Código enviado al correo"
    });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({
      message: "Error al solicitar código",
      error: error.message,
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
      codigoExpiracion: { $gt: Date.now() } // no expirado
    });

    if (!usuario) {
      return res.status(400).json({ message: "Código inválido o expirado" });
    }

    const hashed = await bcrypt.hash(nuevaPassword, 10);

    usuario.passwords = hashed;
    usuario.codigoRecuperacion = undefined;
    usuario.codigoExpiracion = undefined;
    await usuario.save();

    res.json({ message: "Contraseña actualizada correctamente" });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({
      message: "Error al cambiar contraseña",
      error: error.message
    });
  }
};
