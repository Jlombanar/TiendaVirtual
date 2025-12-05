// URL base de tu API
const API_URL = 'https://tiendavirtual-jjxd.onrender.com/api';

// Referencias al DOM
const paso1 = document.getElementById('paso1');
const paso2 = document.getElementById('paso2');
const formSolicitar = document.getElementById('form-solicitar-codigo');
const formCambiar = document.getElementById('form-cambiar-password');
const mensajePaso1 = document.getElementById('mensaje-paso1');
const mensajePaso2 = document.getElementById('mensaje-paso2');
const emailEnviado = document.getElementById('email-enviado');

// Variable para guardar el email
let emailGuardado = '';

/* ======================================================
   Función para validar email
   ====================================================== */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/* ======================================================
   Función para mostrar mensajes
   ====================================================== */
function mostrarMensaje(elemento, mensaje, tipo) {
    elemento.classList.remove('hidden');

    const estiloBase = 'p-4 rounded-lg mb-4 text-sm font-medium transition-all duration-300';

    if (tipo === 'success') {
        elemento.className = `${estiloBase} bg-green-100 text-green-700 border border-green-200`;
        elemento.innerHTML = `
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span><strong>${mensaje}</strong></span>
            </div>
        `;
    } else {
        elemento.className = `${estiloBase} bg-red-100 text-red-700 border border-red-200`;
        elemento.innerHTML = `
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                <span><strong>${mensaje}</strong></span>
            </div>
        `;
    }

    // Auto-ocultar mensajes de éxito después de 5 segundos
    if (tipo === 'success') {
        setTimeout(() => {
            elemento.classList.add('hidden');
        }, 5000);
    }
}

/* ======================================================
   PASO 1: Solicitar código de verificación
   ====================================================== */
formSolicitar.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email-recuperacion').value.trim();
    const btnSolicitar = document.getElementById('btn-solicitar');

    // Validación de email
    if (!email) {
        mostrarMensaje(mensajePaso1, 'Por favor ingresa un correo electrónico', 'error');
        return;
    }

    if (!validarEmail(email)) {
        mostrarMensaje(mensajePaso1, 'Por favor ingresa un correo electrónico válido', 'error');
        return;
    }

    btnSolicitar.disabled = true;
    btnSolicitar.textContent = 'Enviando...';

    try {
        console.log('📧 Solicitando código para:', email);

        const response = await fetch(`${API_URL}/Recuperar/solicitar-codigo`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Correo_Electronico: email })
        });

        const data = await response.json();
        console.log('📥 Respuesta del servidor:', data);

        if (response.ok) {
            // Guardar el email para el siguiente paso
            emailGuardado = email;
            emailEnviado.textContent = email;

            mostrarMensaje(mensajePaso1, 'Código enviado al correo electrónico', 'success');

            // Transición al paso 2
            setTimeout(() => {
                paso1.classList.add('hidden');
                paso2.classList.remove('hidden');
            }, 1500);

        } else {
            mostrarMensaje(mensajePaso1, data.message || data.Message || 'Error al enviar el código', 'error');
        }

    } catch (error) {
        console.error('❌ Error en solicitud:', error);
        mostrarMensaje(mensajePaso1, 'Error de conexión con el servidor. Verifica que el backend esté activo.', 'error');
    } finally {
        btnSolicitar.disabled = false;
        btnSolicitar.textContent = 'Enviar Código';
    }
});


/* ======================================================
   PASO 2: Cambiar contraseña
   ====================================================== */
formCambiar.addEventListener('submit', async (e) => {
    e.preventDefault();

    const codigo = document.getElementById('codigo').value.trim();
    const nuevaPassword = document.getElementById('nueva-password').value.trim();
    const confirmarPassword = document.getElementById('confirmar-password').value.trim();
    const btnCambiar = document.getElementById('btn-cambiar');

    // Validaciones
    if (!codigo || codigo.length !== 6) {
        mostrarMensaje(mensajePaso2, 'El código debe tener exactamente 6 dígitos', 'error');
        return;
    }

    if (nuevaPassword.length < 6) {
        mostrarMensaje(mensajePaso2, 'La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }

    if (nuevaPassword !== confirmarPassword) {
        mostrarMensaje(mensajePaso2, 'Las contraseñas no coinciden', 'error');
        return;
    }

    if (!emailGuardado) {
        mostrarMensaje(mensajePaso2, 'Error: No se detectó el correo electrónico. Por favor inicia el proceso nuevamente.', 'error');
        return;
    }

    btnCambiar.disabled = true;
    btnCambiar.textContent = 'Cambiando...';

    try {
        // Datos a enviar
        const datosEnvio = {
            Correo_Electronico: emailGuardado,
            codigo: codigo,                    
            nuevaPassword: nuevaPassword      
        };

        console.log('🔐 Cambiando contraseña para:', emailGuardado);
        console.log('📤 Datos enviados:', datosEnvio);

        const response = await fetch(`${API_URL}/Recuperar/cambiar-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosEnvio)
        });

        console.log('📊 Status HTTP:', response.status);

        const data = await response.json();
        console.log('📥 Respuesta del servidor:', data);

        if (response.ok) {
            mostrarMensaje(mensajePaso2, '✓ Contraseña actualizada correctamente', 'success');

            // Limpiar datos sensibles
            emailGuardado = '';
            formCambiar.reset();

            // Redireccionar al login
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);

        } else {
            // Mostrar el mensaje de error específico del servidor
            const mensajeError = data.message || data.Message || data.error || 'Error al cambiar la contraseña';
            mostrarMensaje(mensajePaso2, mensajeError, 'error');
            
            console.error('❌ Error del servidor:', data);
        }

    } catch (error) {
        console.error('❌ Error en solicitud:', error);
        mostrarMensaje(mensajePaso2, 'Error de conexión con el servidor. Verifica que el backend esté activo.', 'error');
    } finally {
        btnCambiar.disabled = false;
        btnCambiar.textContent = 'Cambiar Contraseña';
    }
});


/* ======================================================
   Función para regresar al paso 1
   ====================================================== */
function volverPaso1() {
    paso2.classList.add('hidden');
    paso1.classList.remove('hidden');
    formSolicitar.reset();
    formCambiar.reset();
    mensajePaso1.classList.add('hidden');
    mensajePaso2.classList.add('hidden');
    emailGuardado = '';
    console.log('🔄 Regresando al paso 1');
}

// Hacer la función accesible globalmente
window.volverPaso1 = volverPaso1;


/* ======================================================
   Validación de código: solo números, máximo 6 dígitos
   ====================================================== */
const codigoInput = document.getElementById('codigo');
if (codigoInput) {
    codigoInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
    });
}


/* ======================================================
   Mostrar/Ocultar contraseñas
   ====================================================== */
function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.innerHTML = '👁️';
    } else {
        input.type = 'password';
        icon.innerHTML = '👁️‍🗨️';
    }
}

// Hacer la función accesible globalmente
window.togglePassword = togglePassword;


/* ======================================================
   Información de debug al cargar la página
   ====================================================== */
console.log('✅ recuperar.js cargado correctamente');
console.log('🌐 API URL:', API_URL);
console.log('📅 Fecha actual:', new Date().toLocaleString());