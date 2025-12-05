import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import Users from "../models/User";

const trasnporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'jalmpa77@gmail.com',
        pass:'aynaludnodwqazez'
    }
});
// funcion de generar codigo de 6 codigos

const generarCodigo=()=>{
    return Math.floor(100000 + Math.random()* 90000).toString();
};
