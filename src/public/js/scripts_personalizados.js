/**
 * Validar Campos de Correo que sean iguales
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



function validarCorreo() {
  const l_frontral = document.getElementById("licencia_cliente_frontal1");
  const l_trasera = document.getElementById("licencia_cliente_trasera1");


if (l_frontral.value != l_trasera.value) {
alert("hola")
} else {
  alert("no")
}
}