
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

document.addEventListener("DOMContentLoaded", function () {

  // Pattern (Phone) MASCARA PARA EL CAMPO TELEFONO DE SOLICITANTE 
  // solictar - credito formulario largo
  var phoneMasktelmovilsolicitante = IMask(document.getElementById('phonesolicitante'), {
    mask: '+{1} (000) 000-0000'
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Pattern (Phone)  MASCARA PARA EL CAMPO TELEFONO SECUNDARIO DE SOLICITANTE
  var phoneMaskphonetwosolicitante = IMask(document.getElementById('phonetwosolicitante'), {
mask: '+{1} (000) 000-0000'
});
});

document.addEventListener("DOMContentLoaded", function () {
  // Pattern (Phone)
  var phoneMask = IMask(document.getElementById('phone-work'), {
    mask: '+{1} (000) 000-0000'
  });
});

//-----> MASCARA PARA EL CAMPO TELEFONO MOVIL //: DE CO-SOLICITANTE
document.addEventListener("DOMContentLoaded", function () {
  // Pattern (Phone) 
  var phoneMasktel = IMask(document.getElementById('phone-masktel'), {
    mask: '+{1} (000) 000-0000'
  });
});

  //-------> MASCARA PARA EL CAMPO TELEFONO MOVIL //FIXME: SECUNDARIO DE CO-SOLICITANTE
  document.addEventListener("DOMContentLoaded", function () {
    // Pattern (Phone) 
    var phoneMaskteltwo = IMask(document.getElementById('phone-maskteltwo'), {
      mask: '+{1} (000) 000-0000'
    });
  });

    //-------> MASCARA PARA EL CAMPO TELEFONO DE TRABAJO //FIXME: DE CO-SOLICITANTE
    document.addEventListener("DOMContentLoaded", function () {
      // Pattern (Phone) 
      var phoneMaskteltrabajo = IMask(document.getElementById('phone-maskteltrabajo'), {
        mask: '+{1} (000) 000-0000'
      });
    });

      //======//TODO: MASCARAS PARA LOS CAMPOS REFERENCIAS=========  -->

  //-----> MASCARA PARA EL PRIMER CAMPO TELEFONO MOVIL //FIXME: REFERENCIAS
  document.addEventListener("DOMContentLoaded", function () {

    var phoneMasktelreferenciasone = IMask(document.getElementById('phone-masktelreferenciasone'), {
      mask: '+{1} (000) 000-0000'
    });
  });

  //-----> MASCARA PARA EL SEGUNDO CAMPO TELEFONO MOVIL //FIXME: REFERENCIAS
  document.addEventListener("DOMContentLoaded", function () {
    var phoneMasktelreferenciastwo = IMask(document.getElementById('phone-masktelreferenciastwo'), {
      mask: '+{1} (000) 000-0000'
    });

  });

  //-----> MASCARA PARA EL TERCER CAMPO TELEFONO MOVIL //FIXME: REFERENCIAS
  document.addEventListener("DOMContentLoaded", function () {
    var phoneMasktelreferenciasthree = IMask(document.getElementById('phone-masktelreferenciasthree'), {
      mask: '+{1} (000) 000-0000'
    });

  });

  //======//TODO: MASCARAS PARA LOS CAMPOS REFERENCIAS=========  -->
// *  ==>> FIN  Mascara de telefonos

