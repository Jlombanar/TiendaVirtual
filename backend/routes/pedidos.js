import express from 'express';
import { crearPedido, obtenerPedidosUsuario, obtenerPedido,actualizarEstadoPedido, obtenerTodosPedidos
} from '../controllers/Pedidos.js';

const router = express.Router();

// Crear nuevo pedido
router.post('/', crearPedido);

// Obtener pedidos de un usuario
router.get('/usuario/:userId', obtenerPedidosUsuario);

// Obtener un pedido específico
router.get('/:pedidoId', obtenerPedido);

// Actualizar estado de un pedido
router.put('/:pedidoId/estado', actualizarEstadoPedido);

// Obtener todos los pedidos (admin)
router.get('/', obtenerTodosPedidos);

export default router;
