// Función para finalizar la compra y guardar en la base de datos
async function finalizarCompra() {
  try {
    // Obtener el carrito del localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    // Obtener el userId (asume que lo tienes guardado al hacer login)
    const userId = localStorage.getItem('userId') || 'guest';
    
    // Calcular el total
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    // Preparar los datos del pedido
    const pedidoData = {
      userId: userId,
      productos: carrito.map(item => ({
        productId: item.id || item.productId,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
        imagen: item.imagen
      })),
      total: total,
      metodoPago: document.getElementById('metodoPago')?.value || 'efectivo',
      direccionEnvio: {
        calle: document.getElementById('direccion')?.value || '',
        ciudad: document.getElementById('ciudad')?.value || '',
        codigoPostal: document.getElementById('codigoPostal')?.value || '',
        pais: 'Colombia'
      }
    };

    // Enviar el pedido al backend
    const response = await fetch('https://tiendavirtual-jjxd.onrender.com/api/pedidos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pedidoData)
    });

    const data = await response.json();

    if (response.ok) {
      // Limpiar el carrito
      localStorage.removeItem('carrito');
      
      // Mostrar mensaje de éxito
      alert('¡Compra realizada exitosamente! ID del pedido: ' + data.pedido._id);
      
      // Redirigir a página de confirmación o inicio
      window.location.href = 'confirmacion.html?pedidoId=' + data.pedido._id;
    } else {
      alert('Error al procesar la compra: ' + data.message);
    }

  } catch (error) {
    console.error('Error al finalizar la compra:', error);
    alert('Error al procesar la compra. Por favor intente nuevamente.');
  }
}

// Función para agregar al carrito (mejorada)
function agregarAlCarrito(producto) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  
  // Verificar si el producto ya existe
  const index = carrito.findIndex(item => item.id === producto.id);
  
  if (index !== -1) {
    // Si existe, aumentar la cantidad
    carrito[index].cantidad += 1;
  } else {
    // Si no existe, agregarlo
    carrito.push({
      id: producto.id || producto.productId,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1
    });
  }
  
  // Guardar en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));
  
  // Actualizar contador visual
  actualizarContadorCarrito();
  
  // Mostrar notificación
  mostrarNotificacion('Producto agregado al carrito');
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const contador = document.getElementById('cart-counter');
  
  if (contador) {
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    contador.textContent = totalItems;
    contador.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

// Función para mostrar notificación
function mostrarNotificacion(mensaje) {
  const notificacion = document.createElement('div');
  notificacion.className = 'fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
  notificacion.textContent = mensaje;
  document.body.appendChild(notificacion);
  
  setTimeout(() => {
    notificacion.remove();
  }, 3000);
}

// Agregar event listener al botón de compra
document.addEventListener('DOMContentLoaded', () => {
  const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');
  if (btnFinalizarCompra) {
    btnFinalizarCompra.addEventListener('click', finalizarCompra);
  }
  
  // Actualizar contador al cargar la página
  actualizarContadorCarrito();
});