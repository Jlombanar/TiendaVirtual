// pages/java/perfil.js
document.addEventListener('DOMContentLoaded', async function() {
    
    const API_URL = 'https://tiendavirtual-jjxd.onrender.com/api/perfil/obtener';
    
    // Verificar sesión
    if (!localStorage.getItem('sesionActiva')) {
        alert('No hay sesión activa');
        window.location.href = 'login.html';
        return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario'));
    let datosOriginales = {};

    // Cargar perfil desde backend
    async function cargarPerfil() {
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: usuario.email })
            });
            
            const data = await res.json();
            if (res.ok) {
                datosOriginales = data.usuario;
                mostrarDatos(data.usuario);
            }
        } catch (error) {
            console.error('Error:', error);
            mostrarDatos(usuario);
        }
    }

    // Mostrar datos en la vista
    function mostrarDatos(user) {
        const nombre = user.nombre || '';
        const apellido = user.apellido || '';
        const telefono = user.Telefono || user.telefono || '';
        
        if (nombre && apellido) {
            document.getElementById('avatar').textContent = nombre[0].toUpperCase() + apellido[0].toUpperCase();
        }
        document.getElementById('nombre-completo').textContent = `${nombre} ${apellido}`;
        document.getElementById('email-usuario').textContent = user.email;
        document.getElementById('nombre').value = nombre;
        document.getElementById('apellido').value = apellido;
        document.getElementById('email').value = user.email;
        document.getElementById('telefono').value = telefono;
    }
    

    // Cargar datos al iniciar
    cargarPerfil();
});