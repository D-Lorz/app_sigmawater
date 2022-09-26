
// todo * * * * * * * * * * * * * * * * * *
// *  ==>> VALIDACIONES DE CAMPOS 

// ? ==>> Formulario registro de VENDEDORES y editar informacion perfil vendedor desde vendedor
// => Solo letras en los campos (nombres, apellidos, ciudad, banco y beneficiario, / editar ciudad, banco, beneficiario / )
    $("#nombres,#apellidosform,#ciudad,#banco,#beneficiario,#editCiudad,#editBanco,#editBeneficiario").bind('keypress', function (event) {
        var regex = new RegExp("^[a-zA-Z ]+$");
        var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
    });

// ? ==>> Formulario registro de VENDEDORES y editar informacion perfil vendedor desde vendedor
// => Solo numeros el campo ( número de cuenta, enrutamiento, / editar cuenta y enrutamiento / )
$("#cuenta,#ruta,#editCuenta,#editRuta").bind('keypress', function(event) {
    var regex = new RegExp("^[0-9]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (!regex.test(key)) {
      event.preventDefault();
      return false;
    }
  });

// ? ==>> Formulario registro de CLIENTES desde vista propia de registro + desde el dashboard
// => Solo letras en los campos (nombre, segundo nombre, apellidos )
$("#nombreCl,#segundoNombreCl,#apellidoCl,#nombreCl_dash,#apellidoCl_dash").bind('keypress', function (event) {
  var regex = new RegExp("^[a-zA-Z ]+$");
  var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
  if (!regex.test(key)) {
      event.preventDefault();
      return false;
  }
});

// ? ==>> Formulario LARGO SOLICITAR CREDITO PARA CLIENTE 
// => Solo letras en los campos (nombre, segundo nombre, apellidos )
$("#nombreCl_Scredito,#SegundoNcl_Scredito,#apellidosCl_Scredito,#cHipotecaria,#empleador_aplicante,#ocupacion,#empleador_anterior,#otros_ingresos,#nombre_co,#segundo_nombre_co,#apelli_co,#relacion,#empleador_co,#ocupacion_co,#empleador_anterior_co,#ingresos_co,#nom_referencia1_co,#parentesco1_co,#nom_referencia2_co,#parentesco2_co,#nom_referencia3_co,#parentesco3_co").bind('keypress', function (event) {
  var regex = new RegExp("^[a-zA-Z ]+$");
  var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
  if (!regex.test(key)) {
      event.preventDefault();
      return false;
  }
});

// => Solo numeros 
$("#licencia_solicitante,#anio_residencia,#meses_residencia,#anios_trabajando,#meses_trabajando,#anio_bancarrota,#numero_ruta,#numero_cuenta,#licencia,#anios_trabajando_co,#meses_trabajando_co").bind('keypress', function(event) {
  var regex = new RegExp("^[0-9]+$");
  var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
  if (!regex.test(key)) {
    event.preventDefault();
    return false;
  }
});
// ? * * * * * * * * * * * * * * *

// ? ==>> Formulario EDITAR INFORMACIÓN del cliente desde el administrador 
// => Solo letras en los campos (nombre, segundo nombre, apellidos )
$("#PclNombre,#PclSegundo_nombre,#PclApellido,#PclCiudad").bind('keypress', function (event) {
  var regex = new RegExp("^[a-zA-Z ]+$");
  var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
  if (!regex.test(key)) {
      event.preventDefault();
      return false;
  }
});

// Limitar cantidad de número de cifras => oninput="maxlengthNumber(this);" esto va con maxlength=""
  function maxlengthNumber(obj) {
    console.log(obj.value);
    if (obj.value.length > obj.maxLength) {
      obj.value = obj.value.slice(0, obj.maxLength);
    }
  }
