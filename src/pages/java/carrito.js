// Obtener y guardar carrito
function obtenerCarrito() {
  const carrito = localStorage.getItem('carrito');
  return carrito ? JSON.parse(carrito) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContadorCarrito();
}

// Agregar producto al carrito
function agregarAlCarrito(producto) {
  const carrito = obtenerCarrito();
  const indiceExistente = carrito.findIndex(item => item.productId === producto._id);
  
  if (indiceExistente !== -1) {
    carrito[indiceExistente].cantidad++;
  } else {
    carrito.push({
      productId: producto._id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
      imagen: producto.imagen
    });
  }
  
  guardarCarrito(carrito);
  mostrarNotificacion('Producto agregado al carrito', 'success');
}

// Actualizar contador
function actualizarContadorCarrito() {
  const carrito = obtenerCarrito();
  const contador = document.getElementById('cart-counter');
  
  if (contador) {
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    contador.textContent = totalItems;
    contador.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

// Cargar items del carrito
function cargarCarrito() {
  const carrito = obtenerCarrito();
  const contenedorItems = document.getElementById('carrito-items');
  const carritoVacio = document.getElementById('carrito-vacio');
  const carritoAcciones = document.getElementById('carrito-acciones');
  
  if (carrito.length === 0) {
    contenedorItems.innerHTML = '';
    carritoVacio.style.display = 'block';
    carritoAcciones.style.display = 'none';
  } else {
    carritoVacio.style.display = 'none';
    carritoAcciones.style.display = 'flex';
    
    contenedorItems.innerHTML = carrito.map((item, index) => `
      <div class="bg-white rounded-xl shadow-lg p-6 flex gap-6 items-center hover:shadow-xl transition-shadow duration-300">
        <img src="${item.imagen}" alt="${item.nombre}" class="w-24 h-24 object-cover rounded-lg">
        <div class="flex-1">
          <h4 class="text-lg font-bold text-gray-800 mb-2">${item.nombre}</h4>
          <p class="text-2xl font-bold text-blue-600">$${item.precio.toLocaleString('es-CO')}</p>
        </div>
        <div class="flex items-center gap-4">
          <div class="flex items-center border border-gray-300 rounded-lg">
            <button onclick="cambiarCantidad(${index}, -1)" class="px-3 py-2 hover:bg-gray-100">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
              </svg>
            </button>
            <span class="px-4 py-2 font-semibold">${item.cantidad}</span>
            <button onclick="cambiarCantidad(${index}, 1)" class="px-3 py-2 hover:bg-gray-100">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </button>
          </div>
          <button onclick="eliminarDelCarrito(${index})" class="p-2 text-red-600 hover:bg-red-50 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-500 mb-1">Subtotal</p>
          <p class="text-xl font-bold text-gray-800">$${(item.precio * item.cantidad).toLocaleString('es-CO')}</p>
        </div>
      </div>
    `).join('');
  }
  actualizarTotales();
}

// Cambiar cantidad
function cambiarCantidad(index, cambio) {
  let carrito = obtenerCarrito();
  carrito[index].cantidad += cambio;
  if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
  guardarCarrito(carrito);
  cargarCarrito();
}

// Eliminar producto
function eliminarDelCarrito(index) {
  let carrito = obtenerCarrito();
  carrito.splice(index, 1);
  guardarCarrito(carrito);
  cargarCarrito();
  mostrarNotificacion('Producto eliminado', 'info');
}

// Vaciar carrito
function vaciarCarrito() {
  document.getElementById('modal-vaciar').classList.remove('hidden');
  document.getElementById('modal-vaciar').classList.add('flex');
}

function confirmarVaciarCarrito() {
  localStorage.removeItem('carrito');
  actualizarContadorCarrito();
  cargarCarrito();
  cerrarModalVaciar();
  mostrarNotificacion('Carrito vaciado', 'info');
}

function cerrarModalVaciar() {
  document.getElementById('modal-vaciar').classList.add('hidden');
  document.getElementById('modal-vaciar').classList.remove('flex');
}

// Actualizar totales
function actualizarTotales() {
  const carrito = obtenerCarrito();
  const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString('es-CO')}`;
  document.getElementById('total').textContent = `$${subtotal.toLocaleString('es-CO')}`;
}

// Finalizar compra
async function finalizarCompra() {
  const carrito = obtenerCarrito();
  
  if (carrito.length === 0) {
    mostrarNotificacion('El carrito está vacío', 'error');
    return;
  }
  
  const direccion = document.getElementById('direccion').value.trim();
  const ciudad = document.getElementById('ciudad').value.trim();
  const codigoPostal = document.getElementById('codigoPostal').value.trim();
  const metodoPago = document.getElementById('metodoPago').value;
  
  if (!direccion || !ciudad || !codigoPostal) {
    mostrarNotificacion('Completa todos los campos de envío', 'error');
    return;
  }
  
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName') || 'Cliente';
  
  if (!userEmail) {
    mostrarNotificacion('Debes iniciar sesión', 'error');
    setTimeout(() => window.location.href = 'login.html', 2000);
    return;
  }
  
  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const pedido = {
    userId: userEmail,
    productos: carrito,
    total: total,
    metodoPago: metodoPago,
    direccionEnvio: { calle: direccion, ciudad: ciudad, codigoPostal: codigoPostal, pais: 'Colombia' }
  };
  
  const btnFinalizar = document.getElementById('btn-finalizar-compra');
  btnFinalizar.disabled = true;
  btnFinalizar.innerHTML = '<svg class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Procesando...';
  
  try {
    const response = await fetch('http://localhost:8091/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      await fetch('http://localhost:8091/api/enviar-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, nombre: userName, pedido: pedido, pedidoId: data.pedido._id })
      });
      
      localStorage.removeItem('carrito');
      actualizarContadorCarrito();
      mostrarNotificacion('¡Compra realizada! Revisa tu correo', 'success');
      setTimeout(() => window.location.href = 'index.html', 3000);
    } else {
      throw new Error(data.message || 'Error al procesar el pedido');
    }
  } catch (error) {
    console.error('Error:', error);
    mostrarNotificacion('Error al procesar la compra', 'error');
    btnFinalizar.disabled = false;
    btnFinalizar.innerHTML = '<svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>Finalizar Compra';
  }
}

// Mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'success') {
  const notificacion = document.getElementById('notificacion');
  const icono = document.getElementById('notificacion-icon');
  const texto = document.getElementById('notificacion-texto');
  
  const estilos = {
    success: { clase: 'bg-green-600', path: 'M5 13l4 4L19 7' },
    error: { clase: 'bg-red-600', path: 'M6 18L18 6M6 6l12 12' },
    info: { clase: 'bg-blue-600', path: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
  };
  
  const estilo = estilos[tipo] || estilos.info;
  notificacion.className = `fixed top-5 right-5 px-6 py-4 rounded-xl shadow-2xl z-50 ${estilo.clase} text-white flex items-center`;
  icono.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${estilo.path}"/>`;
  texto.textContent = mensaje;
  notificacion.classList.remove('hidden');
  
  setTimeout(() => notificacion.classList.add('hidden'), 3000);
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
  actualizarContadorCarrito();
  
  if (document.getElementById('carrito-items')) {
    cargarCarrito();
    const btnFinalizar = document.getElementById('btn-finalizar-compra');
    if (btnFinalizar) btnFinalizar.addEventListener('click', finalizarCompra);
  }
});

// Funciones globales
window.agregarAlCarrito = agregarAlCarrito;
window.cambiarCantidad = cambiarCantidad;
window.eliminarDelCarrito = eliminarDelCarrito;
window.vaciarCarrito = vaciarCarrito;
window.confirmarVaciarCarrito = confirmarVaciarCarrito;
window.cerrarModalVaciar = cerrarModalVaciar;