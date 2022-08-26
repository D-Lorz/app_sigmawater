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

// ====================================
/**
* *Validar Campos de Correo que sean iguales en perfil del vendedor
* 
*/

function validarCorreosIguales() {
  const correoOne = document.getElementById("idcorreo");
  const correoTwo = document.getElementById("idcorreoConfirmar");
  const btnGCambios = document.getElementById("btnGCambios");
  const alertaC = document.getElementById("alertaCorreo");

  if (correoOne.value != correoTwo.value) {
    btnGCambios.disabled = true;
    alertaCorreo.style.display = 'block'
  } else {
    btnGCambios.disabled = false;
    alertaCorreo.style.display = 'none'
  }
}

/**
* *Validar Campos de Correo que sean iguales en perfil del vendedor
* 
*/

function validarPass() {
  const pass1 = document.getElementById("idPass");
  const pass2 = document.getElementById("idPassConfirmar");
  const btnGCambios = document.getElementById("btnGCambios");
  const alertaP = document.getElementById("alertaPass");

  if (pass1.value != pass2.value) {
    btnGCambios.disabled = true;
    alertaPass.style.display = 'block'
  } else {
    btnGCambios.disabled = false;
    alertaPass.style.display = 'none'
  }


}





