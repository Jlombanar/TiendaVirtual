
document.addEventListener('DOMContentLoaded', function() {
    
    const API_URL = 'http://localhost:8081/api/users/register'; 
    
  
    
    // Mostrar/ocultar contraseñas
    document.getElementById('toggle-password').addEventListener('click', function() {
        const input = document.getElementById('password');
        input.type = input.type === 'password' ? 'text' : 'password';
    });
    
    document.getElementById('toggle-confirm-password').addEventListener('click', function() {
        const input = document.getElementById('confirmPassword');
        input.type = input.type === 'password' ? 'text' : 'password';
    });
    
    // Enviar formulario
    document.getElementById('register-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const errorDiv = document.getElementById('register-error');
        const errorMsg = document.getElementById('register-error-message');
        const btn = document.getElementById('register-btn');
        
        // Obtener datos
       // Validar campos obligatorios y ver cuál falta
  const datos = {
            Nombre: document.getElementById('firstName').value.trim(),
            Apellido: document.getElementById('lastName').value.trim(),
            telefono: document.getElementById('phone').value.trim(),
            Correo_Electronico: document.getElementById('email').value.trim(),
            passwords: document.getElementById('password').value
        };
        
        const confirmPass = document.getElementById('confirmPassword').value;
        
        // Validar contraseñas
        if (datos.passwords !== confirmPass) {
            errorMsg.textContent = 'Las contraseñas no coinciden';
            errorDiv.classList.remove('hidden');
            return;
        }
        
        // Validar términos
        if (!document.getElementById('terms').checked) {
            errorMsg.textContent = 'Debes aceptar los términos';
            errorDiv.classList.remove('hidden');
            return;
        }
        
        // Enviar al servidor
        btn.disabled = true;
        btn.textContent = 'Registrando...';
        
        try {
            const response = await fetch(`${API_URL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            
            const result = await response.json();
            
    if (response.ok) {
    errorDiv.classList.remove('bg-red-50', 'border-red-200', 'text-red-800', 'hidden');
    errorDiv.classList.add('bg-green-50', 'border-green-200', 'text-green-800');
    errorMsg.textContent = '¡Registro exitoso! Redirigiendo...';
    setTimeout(() => window.location.href = 'login.html', 7000);
} else {
                errorMsg.textContent = result.message || 'Error al registrar';
                errorDiv.classList.remove('hidden');
                btn.disabled = false;
                btn.textContent = 'Crear Cuenta';
            }
        } catch (error) {
            errorMsg.textContent = 'Error de conexión';
            errorDiv.classList.remove('hidden');
            btn.disabled = false;
            btn.textContent = 'Crear Cuenta';
        }
    });
});