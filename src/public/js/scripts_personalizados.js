/**
 * *Validar Campos de Correo que sean iguales
 * 
 */

 function validarCorreo() {
  const correo1 = document.getElementById("correo");
  const correo2 = document.getElementById("confirmar_correo");
  const botonSgte = document.getElementById("btnSgteRegistro");
  const alerta = document.getElementById("alertaCorreos");

if (correo1.value != correo2.value) {
  botonSgte.disabled = true;
  alertaCorreos.style.display = 'block'
} else {
  botonSgte.disabled = false;
  alertaCorreos.style.display = 'none'
}
}

const button=document.querySelector('#botonCopy');

const input =docunent.querySelector('.clipboard');

button.addEventListener('click', function(){
 input.focus();
document.execConnand('selectAll');
document.execConnand('copy');

});
