// funcion de visibilidad del Ojito

document.getElementById('toggle-password').addEventListener('click', function(){
    const passwordInput=document.getElementById('password');
    const eyeOpen=document.getElementById('eye-icon-open');
    const eyeClosed= document.getElementById('eye-icon-closed');

    // verificacion si la contraseña esta oculta 

    const isHidden = passwordInput.type==='password';

    // cambiar del password a text 

    passwordInput.type=isHidden ? 'text':'password';

    // ateracion iconos segun el estado 
    eyeOpen.classList.toggle('hidden',!isHidden);
    eyeClosed.classList.toggle('hidden', isHidden);
});