import mongoose from 'mongoose';

const pedidoSchema = new mongoose.Schema({
  productos:[{productId: {type: String,required: true },
  nombre: {type: String,required: true },
  precio: {type: Number,required: true},
  cantidad: {type: Number,required: true,default: 1 },
  imagen: String}],
  total: { type: Number,required: true},
  estado: {type: String,enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'],default: 'pendiente' },
  metodoPago: { type: String, required: true},
  direccionEnvio: {calle: String, ciudad: String,codigoPostal: String,pais: String},
  fechaPedido: {type: Date,default: Date.now}
});

export default mongoose.model('Pedido', pedidoSchema);