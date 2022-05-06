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



// * COPIAR CODIGO




// * COPIAR CODIGO

const elemento = document.querySelector('#contenido-texto');

document.querySelector('#botonCopy').addEventListener('click',()=>{
  copyToClipBoard(elemento);

})

function copyToClipBoard(elemento){
    const inputOculto = document.createElement('input');

    inputOculto.setAttribute('value', elemento.innerText);

    document.body.appendChild(inputOculto);

    inputOculto.select();

    document.execCommand('copy');
    document.body.removeChild(inputOculto);
}

