// actualizarPerfil.js
document.addEventListener('DOMContentLoaded', async function() {
    
    const API_URL = 'https://tiendavirtual-jjxd.onrender.com/api/perfil/actualizar';
    
    // Elementos del DOM
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const emailInput = document.getElementById('email');
    const telefonoInput = document.getElementById('telefono');
    const avatarDiv = document.getElementById('avatar');
    const nombreCompleto = document.getElementById('nombre-completo');
    const btnEditar = document.getElementById('btn-editar');
    const btnCancelar = document.getElementById('btn-cancelar');
    const mensajeRespuesta = document.getElementById('mensaje-respuesta');

    // Obtener datos del usuario del localStorage
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));

    // Función para habilitar edición
    btnEditar.addEventListener('click', () => {
        const estaEditando = !nombreInput.hasAttribute('readonly');
        
        if (estaEditando) {
            // Guardar cambios
            guardarCambios();
        } else {
            // Habilitar edición
            nombreInput.removeAttribute('readonly');
            apellidoInput.removeAttribute('readonly');
            telefonoInput.removeAttribute('readonly');
            
            nombreInput.classList.remove('bg-gray-100');
            apellidoInput.classList.remove('bg-gray-100');
            telefonoInput.classList.remove('bg-gray-100');
            
            nombreInput.classList.add('bg-white', 'border-blue-300');
            apellidoInput.classList.add('bg-white', 'border-blue-300');
            telefonoInput.classList.add('bg-white', 'border-blue-300');
            
            btnEditar.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Guardar
            `;
            btnEditar.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            btnEditar.classList.add('bg-green-600', 'hover:bg-green-700');
            
            btnCancelar.classList.remove('hidden');
        }
    });

    // Función para cancelar edición
    btnCancelar.addEventListener('click', () => {
        // Recargar los datos originales
        nombreInput.value = usuarioLogueado.nombre || '';
        apellidoInput.value = usuarioLogueado.apellido || '';
        telefonoInput.value = usuarioLogueado.telefono || '';
        
        deshabilitarEdicion();
    });

    // Función para guardar cambios
    async function guardarCambios() {
        const datosActualizados = {
            email: emailInput.value,
            nombre: nombreInput.value.trim(),
            apellido: apellidoInput.value.trim(),
            telefono: telefonoInput.value.trim()
        };
        
        // Validaciones
        if (!datosActualizados.nombre || !datosActualizados.apellido || !datosActualizados.telefono) {
            mostrarMensaje('Todos los campos son obligatorios', 'error');
            return;
        }
        
        try {
            const response = await fetch(API_URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosActualizados)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Actualizar localStorage con los nuevos datos
                const usuarioActualizado = {
                    ...usuarioLogueado,
                    nombre: data.usuario.nombre,
                    apellido: data.usuario.apellido,
                    telefono: data.usuario.telefono
                };
                localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
                
                // Actualizar avatar y nombre completo en la UI
                nombreCompleto.textContent = `${data.usuario.nombre} ${data.usuario.apellido}`;
                const iniciales = `${data.usuario.nombre.charAt(0)}${data.usuario.apellido.charAt(0)}`.toUpperCase();
                avatarDiv.textContent = iniciales;
                
                mostrarMensaje(data.message, 'exito');
                deshabilitarEdicion();
            } else {
                mostrarMensaje(data.message || 'Error al actualizar perfil', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarMensaje('Error de conexión con el servidor', 'error');
        }
    }

    // Función para deshabilitar edición
    function deshabilitarEdicion() {
        nombreInput.setAttribute('readonly', true);
        apellidoInput.setAttribute('readonly', true);
        telefonoInput.setAttribute('readonly', true);
        
        nombreInput.classList.remove('bg-white', 'border-blue-300');
        apellidoInput.classList.remove('bg-white', 'border-blue-300');
        telefonoInput.classList.remove('bg-white', 'border-blue-300');
        
        nombreInput.classList.add('bg-gray-100');
        apellidoInput.classList.add('bg-gray-100');
        telefonoInput.classList.add('bg-gray-100');
        
        btnEditar.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
        `;
        btnEditar.classList.remove('bg-green-600', 'hover:bg-green-700');
        btnEditar.classList.add('bg-blue-600', 'hover:bg-blue-700');
        
        btnCancelar.classList.add('hidden');
    }

    // Función para mostrar mensajes
    function mostrarMensaje(mensaje, tipo) {
        mensajeRespuesta.classList.remove('hidden');
        
        if (tipo === 'exito') {
            mensajeRespuesta.className = 'p-4 rounded-xl text-center text-lg font-semibold bg-green-100 text-green-700 border border-green-300';
        } else {
            mensajeRespuesta.className = 'p-4 rounded-xl text-center text-lg font-semibold bg-red-100 text-red-700 border border-red-300';
        }
        
        mensajeRespuesta.textContent = mensaje;
        
        setTimeout(() => {
            mensajeRespuesta.classList.add('hidden');
        }, 3000);
    }

});