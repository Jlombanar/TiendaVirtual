import bcrypt from "bcrypt";
import Users from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

// -------------------------------
// GENERAR CÓDIGO
// -------------------------------
const generarCodigo = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// -------------------------------
// ENVIAR CORREO (SIN INSTALAR NADA)
// -------------------------------
const enviarCorreo = async (destinatario, codigo) => {
  const API_KEY = process.env.MAILERSEND_API_KEY;
  const FROM_EMAIL = process.env.MAILERSEND_FROM;

  if (!API_KEY || !FROM_EMAIL) {
    console.error("❌ MAILERSEND_API_KEY o MAILERSEND_FROM no configurados");
    return false;
  }

  try {
    const resp = await fetch("https://api.mailersend.com/v1/email", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: { email: FROM_EMAIL },
        to: [{ email: destinatario }],
        subject: "Código de Recuperación",
        html: `
          <div style="font-family: Arial; padding: 20px;">
            <h2>Recuperación de Contraseña</h2>
            <p>Tu código es:</p>
            <h1 style="color:#2563eb; font-size:40px;">${codigo}</h1>
            <p>Expira en 15 minutos.</p>
          </div>
        `,
      }),
    });

    return resp.ok; // true o false

  } catch (err) {
    console.error("❌ Error al enviar correo:", err);
    return false;
  }
};

// ---------------------------------------------------------
// 1. SOLICITAR CÓDIGO
// ---------------------------------------------------------
export const solicitarCodigo = async (req, res) => {
  try {
    const { Correo_Electronico } = req.body;

    if (!Correo_Electronico)
      return res.status(400).json({ message: "Correo obligatorio" });

    const usuario = await Users.findOne({ Correo_Electronico });

    if (!usuario)
      return res.status(400).json({ message: "Correo no registrado" });

    const codigo = generarCodigo();

    usuario.codigoRecuperacion = codigo;
    usuario.codigoExpiracion = Date.now() + 15 * 60 * 1000;
    await usuario.save();

    const enviado = await enviarCorreo(Correo_Electronico, codigo);

    if (!enviado)
      return res.status(500).json({ message: "No se pudo enviar el correo" });

    res.json({ message: "Código enviado" });

  } catch (e) {
    console.error("❌ Error:", e);
    res.status(500).json({ message: "Error interno", error: e.message });
  }
};

// ---------------------------------------------------------
// 2. CAMBIAR CONTRASEÑA
// ---------------------------------------------------------
export const cambiarPassword = async (req, res) => {
  try {
    const { Correo_Electronico, codigo, nuevaPassword } = req.body;

    if (!Correo_Electronico || !codigo || !nuevaPassword)
      return res.status(400).json({ message: "Todos los campos son obligatorios" });

    const usuario = await Users.findOne({
      Correo_Electronico,
      codigoRecuperacion: codigo,
      codigoExpiracion: { $gt: Date.now() },
    });

    if (!usuario)
      return res.status(400).json({ message: "Código inválido o expirado" });

    usuario.passwords = await bcrypt.hash(nuevaPassword, 10);
    usuario.codigoRecuperacion = undefined;
    usuario.codigoExpiracion = undefined;

    await usuario.save();

    res.json({ message: "Contraseña actualizada" });

  } catch (e) {
    console.error("❌ Error:", e);
    res.status(500).json({ message: "Error interno", error: e.message });
  }
};
