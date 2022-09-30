/**
 * * Validar Campos de Correo que sean iguales en el formulario de registro de vendedores
 * 
 */
function validarCorreo() {
  const correo = $("#correo").val();
 
  fetch('/consultarCorreo', {

    method: 'POST',
    body: JSON.stringify({ correo }),
    headers: { 'Content-Type': 'application/json' }

  }).then(res => res.json())
    .catch(error => console.error('Error', error))
    .then(response => {
      console.log("============>>>>>>>>>",response);

      const correo1 = document.getElementById("correo");
      const correo2 = document.getElementById("confirmar_correo");
      const botonSgte = document.getElementById("btnSgteRegistro");
      const alerta = document.getElementById("alertaCorreos");
      const mensaje = document.getElementById("mensaje");

      if (correo1.value != correo2.value || !response) {
        botonSgte.disabled = true;
        alertaCorreos.style.display = 'block'
        if (!response) {
          mensaje.textContent = "Ya hay un usuario registrado con este correo "
          correo2.setAttribute('readonly', '')
        } else {
          mensaje.textContent = "Los correos no coinciden"
          correo2.removeAttribute('readonly')
        }
      } else {
        botonSgte.disabled = false;
        alertaCorreos.style.display = 'none'
        correo2.removeAttribute('readonly')
      }

    })


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

// ====================================
/**
* *Validar Campos de CONTRASEÑAS que sean iguales en perfil del vendedor
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

// ====================================
/**
* *Validar campo de FECHA DE INSTALACIÓN 
* 
*/
function validarFecha() {
  let valor = document.getElementById("fechaInstalacion");
  const btnRegistro = document.getElementById("btnRegistro");
  const alertaFechas = document.getElementById("alertaFecha");

  if (valor.value == "" || valor.value == null) {
    btnRegistro.disabled = true;
    alertaFecha.style.display = 'block'
  } else if(valor.value){
    btnRegistro.disabled = false;
    alertaFecha.style.display = 'none'
  }
}

// ====================================
/**
* *Validar campo de agendar instalación 
* si existe una hora inicial que exista tambien la hora final
*/
function validarHoras() {
  let desde = document.getElementById("horaInicial");
  let hasta = document.getElementById("horaFinal");
  const btnAgenda = document.getElementById("btnAgenda");
  const alertaHora = document.getElementById("alertaHoras");

  if (desde.value && hasta.value == "" ) {
    btnAgenda.disabled = true;
    alertaHoras.style.display = 'block'
  } else if(desde.value && hasta.value){
    btnAgenda.disabled = false;
    alertaHoras.style.display = 'none'
  }
}









