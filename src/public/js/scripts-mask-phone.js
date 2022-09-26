
// todo * * * * * * * * * * * * * * * * * *
// *  ==>> Mascara de telefonos 

// ==>> MASCARA PARA EL CAMPO DE TELÉFONO DEL REGISTRO DE VENDEDORES
document.addEventListener("DOMContentLoaded", function () {
  var phoneMaskRegister = IMask(document.getElementById('telefonoform'), {
    mask: '+{1} (000) 000-0000'
  });

});

// ==>> MASCARA PARA EL CAMPO TELÉFONO DEL DASHBOARD VENDEDOR
document.addEventListener("DOMContentLoaded", function () {
  var phoneMaskTelClDash = IMask(document.getElementById('tel-cliente-dash'), {
    mask: '+{1} (000) 000-0000'
  });

});

// ==>> MASCARA PARA EL CAMPO DE TELÉFONO DEL REGISTRO DE CLIENTES
document.addEventListener("DOMContentLoaded", function () {
  var phoneMaskRegister = IMask(document.getElementById('tel-cliente'), {
    mask: '+{1} (000) 000-0000'
  });

});

// ==>> MASCARA PARA EL CAMPO DE TELÉFONO DEL EDITAR INFORMACIÓN DEL VENDEDOR DESDE SU PERFIL
document.addEventListener("DOMContentLoaded", function () {
  var phoneMaskRegister = IMask(document.getElementById('telefono_movil'), {
    mask: '+{1} (000) 000-0000'
  });

});

// ==>> MASCARA PARA EL CAMPO DE TELÉFONO EDITAR DATOS DEL CLIENTE DESDE EL ADMIN 
document.addEventListener("DOMContentLoaded", function () {
  var phoneMaskperfilCl = IMask(document.getElementById('PclTelefono'), {
    mask: '+{1} (000) 000-0000'
  });

});

// *  ==>> FIN  Mascara de telefonos

