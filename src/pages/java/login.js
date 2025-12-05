// script de Login - TechStore Pro 



// Verificar que toda la pagina este cargada con  los elementos 
// html 

document.addEventListener('DOMContentLoaded',function(){
    console.log('✅ Pagina Cargada Correcta - Sistema listo');

    // creanmos la constante de la Api 
     const API_URL="https://tiendavirtual-jjxd.onrender.com/api/login";

     // Enviar los datos del formulario 

     document.getElementById('login-form').addEventListener('submit',async function (e){
        e.preventDefault();
        
        // preaparamos los elemntos de la pagina 
        const btn = document.getElementById('login-btn');
        const errorDiv=document.getElementById('login-error');
        const errorMsg=document.getElementById('login-error-message');

        errorDiv.classList.add('hidden');

        // recoger los campos del formulario 

        const datos={
            Correo_Electronico:document.getElementById('email').value.trim(),
            passwords:document.getElementById('password').value
        };

       // validamos que los campos no esten vacios

       if (!datos.Correo_Electronico || !datos.passwords){
        errorMsg.textContent='Por favor  completa los datos';
        errorDiv.classList.remove('hidden');
        return;
       }
       // cambia el boton mientras procesa 

       btn.disabled=true;
       btn.textContent='Iniciando sesion...';

       // envia los datos al servidor 

       try {
        const response= await fetch(API_URL,{
            method:'POST',
            headers :{'Content-Type': 'application/json'},
            body: JSON.stringify(datos)
        });
        // Recibir respuesta del servidor 
          const resultado= await response.json();
          if (response.ok){
            console.log('201- Inicio de sesion exitoso');

            // guardar Informacion 
            localStorage.setItem("sesionActiva", "true");
            localStorage.setItem("usuario",JSON.stringify({
                id: resultado.usuario.id,
                Nombre: resultado.usuario.Nombre,
                Apellido:resultado.usuario.Apellido,
                email:resultado.usuario.email,
                telefono:resultado.usuario.telefono
            }));

            //mensaje de exito 
            errorDiv.className='bg-green-50 border-green-200 text-green-800 px-4 py-3 rounded-lg';
            errorMsg.textContent='Inicio de sesion , Redirigiendo.....';
            errorDiv.classList.remove('hidden');

            // redirigir a prodcutos 

            setTimeout(()=> window.location.href ='productos.html', 8000);
          // credecniaciales incorrectas
          } else {
            errorMsg.textContent=resultado.message || ' Credenciales incorrectas';
            errorDiv.classList.remove('hidden');
            btn.disabled=false;
            btn.innerHTML='iniciar sesion';
          }

         // si no hay conexion al servidor 
       } catch (error) {
        console.error('Error 404- Error de conexion con el servidor');
        errorMsg.textContent='Error conexion de servidor';
        errorDiv.classList.remove('hidden');
        btn.disabled=false;
         btn.innerHTML='iniciar sesion';

        
       }

     });
        
     });


