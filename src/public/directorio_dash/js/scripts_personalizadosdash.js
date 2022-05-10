


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

