import mongoose from "mongoose";
const uri = "mongodb+srv://adsotarde:adso2025@ecommer.4oqujgq.mongodb.net/Tienda?retryWrites=true&w=majority";
mongoose.connect(uri)
.then(()=> console.log("✅ conectado a la base de datos"))
.catch(err => console.log("❌ error al conectar la base de datos",err));