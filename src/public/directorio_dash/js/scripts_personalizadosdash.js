


// * COPIAR CODIGO
const elemento = document.querySelector('#contenido-texto').value
  document.querySelector('#botonCopy').addEventListener('click',()=>{

  document.querySelector('.mensaje-copy').classList.add('show');

  copyToClipBoard(elemento);

  setTimeout(() => {
    document.querySelector('.mensaje-copy').classList.remove('show')
  }, 2000)
})

function copyToClipBoard(elemento){
    const inputOculto = document.createElement('input');
    inputOculto.setAttribute('value', elemento);
    document.body.appendChild(inputOculto);
    inputOculto.select();
    document.execCommand('copy');
    document.body.removeChild(inputOculto);
}

