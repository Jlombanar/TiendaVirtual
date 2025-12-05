import express from "express";
import { LoginUsuario } from "../controllers/login.js";

const router=express.Router();

// la ruta 

router.post("/",LoginUsuario);

export default router;