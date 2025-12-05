
function obtenerCarrito() {
  const carrito = localStorage.getItem('carrito');
  return carrito ? JSON.parse(carrito) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function agregarAlCarrito(producto) {
  let carrito = obtenerCarrito();
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
  mostrarNotificacion('✅ Producto agregado al carrito');
}

function actualizarContadorCarrito() {
  const carrito = obtenerCarrito();
  const contador = document.getElementById('cart-counter');
  
  if (contador) {
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    contador.textContent = totalItems;
    contador.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

function mostrarNotificacion(mensaje) {
  // Crear notificación temporal
  const notif = document.createElement('div');
  notif.textContent = mensaje;
  notif.style.cssText = 'position:fixed;top:20px;right:20px;background:#10b981;color:white;padding:15px 25px;border-radius:10px;z-index:9999;font-weight:bold;box-shadow:0 4px 12px rgba(0,0,0,0.2)';
  document.body.appendChild(notif);
  
  setTimeout(() => notif.remove(), 3000);
}


// TU FUNCIÓN DE CARGAR PRODUCTOS


async function cargarProductos() {
  try {
    const response = await fetch('https://tiendavirtual-jjxd.onrender.com/api/productos');
    const productos = await response.json();

    const grid = document.getElementById('products-grid');
    grid.innerHTML = productos.map(producto => `
      <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 product-card"
         data-category="laptops"
         data-price="${producto.Precio}"
         data-product-id="${producto._id}">
        
         <div class="bg-linear-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center overflow-hidden relative">
           <img src="${producto.Image}" alt="${producto.Nombre}"
           class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
           loading="lazy">
           
           <div class="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-b-full text-xs font-bold">
             -15%
           </div>
         </div>

         <div class="p-6">
           <h3 class="text-lg font-bold text-gray-900">
             ${producto.Nombre}
           </h3>

           <p class="text-sm text-gray-800 mb-4">
             ${producto.Descripcion}
           </p>

           <div class="flex items-center justify-between mb-4">
             <div>
               <span class="text-2xl font-bold text-blue-600">
                 $${(producto.Precio || 0).toLocaleString('es-CO')}
               </span>
             </div>

             <div class="flex text-yellow-600">
               ⭐️⭐️⭐️⭐️⭐️
             </div>
           </div>
           
           <div class="flex space-x-2">
             <button class="ver-detalles-btn bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition duration-300 flex-1 text-sm">
               Ver detalles
             </button>
             <button class="add-to-cart-btn bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex-1 text-sm"
               data-producto-id="${producto._id}"
               data-producto-nombre="${producto.Nombre.replace(/"/g, '&quot;')}"
               data-producto-precio="${producto.Precio}"
               data-producto-imagen="${producto.Image}">
               Comprar
             </button>
           </div>
         </div>
      </div> 
    `).join('');
    
    // Agregar event listeners DESPUÉS de crear los elementos
    agregarEventListeners();
    
    console.log("Productos cargados con éxito");

  } catch (error) {
    console.error("Error al cargar los productos", error);
  }
}

// ========================================
// EVENT LISTENERS PARA BOTONES
// ========================================

function agregarEventListeners() {
  const botonesComprar = document.querySelectorAll('.add-to-cart-btn');
  
  botonesComprar.forEach(boton => {
    boton.addEventListener('click', function() {
      const producto = {
        _id: this.getAttribute('data-producto-id'),
        nombre: this.getAttribute('data-producto-nombre'),
        precio: parseFloat(this.getAttribute('data-producto-precio')),
        imagen: this.getAttribute('data-producto-imagen')
      };
      
      agregarAlCarrito(producto);
    });
  });
}

// ========================================
// INICIALIZACIÓN
// ========================================

// Cargar productos al inicio
cargarProductos();

// Actualizar contador al cargar la página
actualizarContadorCarrito();

// Actualizar productos cada 5 segundos
setInterval(() => {
  cargarProductos();
}, 5000);