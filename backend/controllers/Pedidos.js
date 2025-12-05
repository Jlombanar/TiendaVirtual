import Pedido from "../models/Pedidos.js";

// Crear un nuevo pedido
export const crearPedido = async (req, res) => {
  try {
    const { userId, productos, total, metodoPago, direccionEnvio } = req.body;
    
    // Validar que vengan los datos necesarios
    if (!userId || !productos || productos.length === 0) {
      return res.status(400).json({ 
        message: "Faltan datos obligatorios" 
      });
    }

    const nuevoPedido = new Pedido({
      userId,
      productos,
      total,
      metodoPago,
      direccionEnvio,
      estado: 'pendiente'
    });
    
    await nuevoPedido.save();
    
    res.status(201).json({ 
      message: "Pedido creado exitosamente",
      pedido: nuevoPedido
    });
  } catch (error) {
    console.error("Error al crear el pedido:", error);
    res.status(500).json({
      message: "Error al crear el pedido",
      error: error.message
    });
  }
};

// Obtener todos los pedidos de un usuario
export const obtenerPedidosUsuario = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const pedidos = await Pedido.find({ userId }).sort({ fechaPedido: -1 });
    
    res.json(pedidos);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).json({ 
      message: "Error al obtener los pedidos",
      error: error.message 
    });
  }
};

// Obtener un pedido específico
export const obtenerPedido = async (req, res) => {
  try {
    const { pedidoId } = req.params;
    
    const pedido = await Pedido.findById(pedidoId);
    
    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }
    
    res.json(pedido);
  } catch (error) {
    console.error("Error al obtener el pedido:", error);
    res.status(500).json({ 
      message: "Error al obtener el pedido",
      error: error.message 
    });
  }
};

// Actualizar estado del pedido
export const actualizarEstadoPedido = async (req, res) => {
  try {
    const { pedidoId } = req.params;
    const { estado } = req.body;
    
    const pedido = await Pedido.findByIdAndUpdate(
      pedidoId,
      { estado },
      { new: true }
    );
    
    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }
    
    res.json({ 
      message: "Estado actualizado",
      pedido 
    });
  } catch (error) {
    console.error("Error al actualizar el pedido:", error);
    res.status(500).json({ 
      message: "Error al actualizar el pedido",
      error: error.message 
    });
  }
};

// Obtener todos los pedidos (admin)
export const obtenerTodosPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find().sort({ fechaPedido: -1 });
    res.json(pedidos);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).json({ 
      message: "Error al obtener los pedidos",
      error: error.message 
    });
  }
};