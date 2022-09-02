const conexion = require("../database/db");
const bcryptjs = require("bcryptjs");
var nodemailer = require('nodemailer');

// todo: ==> Generar codigo de vendedor alphanumerico
  const generateRandomString = (num) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result1 = "";
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result1;
  };

// todo: ==> Registrar vendedor
  exports.registrar = async (req, res) => {
    const year = new Date().getFullYear();
    let mes = new Date().getMonth();
    mes == 0 ? (mes = 12) : (mes = mes + 1);
  // ? NOTA: ==>> Esta es la forma para obtener el numero de la semana actual del año entero <<<<<
    currentdate = new Date();
    const oneJan = new Date(currentdate.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
    const semana = Math.ceil((currentdate.getDay() + numberOfDays) / 7) - 1;
  // ? NOTA: ==>> Esta es la forma para obtener la fecha actual <<<<<
    const dia = new Date().getDate();

    const nombres = req.body.nombres;
    const apellidos = req.body.apellidos;
    const fecha_nacimiento = req.body.fecha_nacimiento;
    const telefono_movil = req.body.telefono_movil;
    const correo = req.body.correo;
    const seguro_social = req.body.seguro_social;
    const ciudad = req.body.ciudad;
    const direccion = req.body.direccion;
    const apt_suite_unidad = req.body.apt_suite_unidad;
    const codigo_postal = req.body.codigo_postal;
    let codigo_afiliado = req.body.codigo_afiliado;
    const nombre_banco = req.body.nombre_banco;
    const numero_cuenta = req.body.numero_cuenta;
    const ruta = req.body.ruta;
    const beneficiario = req.body.beneficiario;
    const frontal = "../licences/" + urlLicencias[0];
    const trasera = "../licences/" + urlLicencias[1];
    const licencia_conduccion = JSON.stringify({ frontal: frontal, trasera: trasera});
    const id_vendedor = generateRandomString(6);
    
    const sellerB = await conexion.query("SELECT id_vendedor, estado_de_la_cuenta FROM usuarios WHERE id_vendedor = ? AND estado_de_la_cuenta = 'aprobado'", [codigo_afiliado])
    if (sellerB.length == 0) { codigo_afiliado = "N/A" }

    const nuevoRegistro = {
      year, mes,semana,dia, nombres, apellidos,fecha_nacimiento,telefono_movil,
      correo, seguro_social,ciudad, direccion,apt_suite_unidad, codigo_postal, codigo_afiliado,
      nombre_banco,numero_cuenta, ruta, beneficiario,licencia_conduccion, id_vendedor};

    const nombresUser = nombres
    const apellidosUser = apellidos
    const usuarios = { nombresUser, apellidosUser, correo, id_vendedor, codigo_afiliado };

    await conexion.query("INSERT INTO usuarios SET ?", [usuarios]);
    await conexion.query("INSERT INTO registro_de_vendedores SET ?", [ nuevoRegistro ]);

    console.log("\n+========= >>>>>> HUBO UN NUEVO REGISTRO <<<<<<<<<<============\n"); 

    let admin = await conexion.query(" SELECT * FROM usuarios WHERE rol = 'administrador';");
    admin = admin[0]

    // ! ************* PROCESO DEL EMAIL PARA EL ADMIN ************
    const transporter = nodemailer.createTransport({ 
      host: 'mail.3csigmawater.com',
        port: 465, //cambiar el puerto a 465 cuando antes de subir al server el proyecto
        auth: {
            user: 'noreplys@3csigmawater.com', // Your correo id
            pass: '3csigma3c' // Your pass
        }
    });
    
    const mailOptions = {
      from: "'3C Sigma Water System <noreplys@3csigmawater.com>'",
      to: 'finance@3csigmawater.com',
      subject: 'Mensaje solo para administrador',
      html: '<style>'+
      ' a[x-apple-data-detectors] {'+
        'color: inherit !important;'+
        'text-decoration: inherit !important;'+
      '}'+

      '#MessageViewBody a {'+
        'color: inherit;'+
        'text-decoration: none;'+
      '}'+

      'p {'+
        'line-height: inherit'+
      '}'+

      '.desktop_hide,'+
      '.desktop_hide table {'+
        'mso-hide: all;'+
        'display: none;'+
        'max-height: 0px;'+
        'overflow: hidden;'+
      '}'+

      '@media (max-width:620px) {'+
        '.desktop_hide table.icons-inner {'+
          'display: inline-block !important;'+
        '}'+

        '.icons-inner {'+
          'text-align: center;'+
        '}'+

        '.icons-inner td {'+
          'margin: 0 auto;'+
        '}'+

        '.fullMobileWidth,'+
        '.row-content {'+
          'width: 100% !important;'+
        '}'+

        '.mobile_hide {'+
          'display: none;'+
        '}'+

        '.stack .column {'+
          'width: 100%;'+
          'display: block;'+
        '}'+

        '.mobile_hide {'+
          'min-height: 0;'+
          'max-height: 0;'+
          'max-width: 0;'+
          'overflow: hidden;'+
          'font-size: 0px;'+
        '}'+

        '.desktop_hide,'+
        '.desktop_hide table {'+
          'display: table !important;'+
          'max-height: none !important;'+
        '}'+
      '}'+
    '</style>'+
  '</head>'+
        '<table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: transparent;" width="100%">'+
        ' <tbody>'+
            '<tr>'+
              '<td>'+
                '<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">'+
                  '<tbody>'+
                    '<tr>'+
                      '<td>'+
                        '<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f6f6f6; color: #000000; width: 600px;" width="600">'+
                          '<tbody>'+
                            '<tr>'+
                              '<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">'+
                                '<table border="0" cellpadding="0" cellspacing="0" class="image_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">'+
                                  '<tr>'+
                                    '<td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">'+
                                      '<div align="center" class="alignment" style="line-height:10px"><img class="fullMobileWidth" src="https://3csigmawater.com/correos_html/banner-admin.jpg" style="display: block; height: auto; border: 0; width: 600px; max-width: 100%;" width="600" /></div>'+
                                    '</td>'+
                                  '</tr>'+
                                '</table>'+
                              '</td>'+
                            '+</tr>'+
                          '</tbody>'+
                        '</table>'+
                      '</td>'+
                    '</tr>'+
                  '</tbody>'+
                '</table>'+
                '<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">'+
                  '<tbody>'+
                    '<tr>'+
                      '<td>'+
                        '<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; border-radius: 0; width: 600px;" width="600">'+
                          '<tbody>'+
                            '<tr>'+
                              '<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">'+
                                '<table border="0" cellpadding="0" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">'+
                                  '<tr>'+
                                    '<td class="pad" style="width:100%;text-align:center;">'+
                                      '<h1 style="margin: 0; color: #8a3c90; font-size: 38px; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; line-height: 120%; text-align: center; direction: ltr; font-weight: 700; letter-spacing: normal; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">Hola '+admin.nombresUser+' </span></h1>'+
                                    '</td>'+
                                  '</tr>'+
                                '</table>'+
                                '<table border="0" cellpadding="0" cellspacing="0" class="paragraph_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">'+
                                  '<tr>'+
                                    '<td class="pad" style="padding-top:25px;">'+
                                      '<div style="color:#101112;font-size:16px;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-weight:400;line-height:120%;text-align:center;direction:ltr;letter-spacing:0px;mso-line-height-alt:19.2px;">'+
                                        '<p style="margin: 0; margin-bottom: 2px;">'+nombres+' '+apellidos+' acaba de registrarse como vendedor en</p>'+
                                        '<p style="margin: 0;">3C Sigma Water System</p>'+
                                      '</div>'+
                                    '</td>'+
                                  '</tr>'+
                                '</table>'+
                              '</td>'+
                            '</tr>'+
                          '</tbody>'+
                        '</table>'+
                      '</td>'+
                    '</tr>'+
                  '</tbody>'+
                '</table>'+
                '<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">'+
                  '<tbody>'+
                    '<tr>'+
                      '<td>'+
                        '<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 600px;" width="600">'+
                          '<tbody>'+
                            '<tr>'+
                              '<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 25px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">'+
                                '<table border="0" cellpadding="0" cellspacing="0" class="button_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">'+
                                  '<tr>'+
                                    '<td class="pad" style="text-align:center;">'+
                                      '<div align="center" class="alignment">'+
                                        '<!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://app.3csigmawater.com/vendedores" style="height:42px;width:480px;v-text-anchor:middle;" arcsize="15%" stroke="false" fillcolor="#fed061"><w:anchorlock /><v:textbox inset="0px,0px,0px,0px"><center style="color:#000000; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="https://app.3csigmawater.com/vendedores" style="text-decoration:none;display:block;color:#000000;background-color:#fed061;border-radius:6px;width:80%; width:calc(80% - 2px);border-top:1px solid #fed061;font-weight:700;border-right:1px solid #fed061;border-bottom:1px solid #fed061;border-left:1px solid #fed061;padding-top:5px;padding-bottom:5px;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;" target="_blank"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal;"><span dir="ltr" style="word-break: break-word; line-height: 32px;">Revisar vendedores</span></span></a>'+
                                          '<!--[if mso]></center></v:textbox></v:roundrect><![endif]-->'+
                                      '</div>'+
                                    '</td>'+
                                  '</tr>'+
                                '</table>'+
                                '<table border="0" cellpadding="0" cellspacing="0" class="image_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">'+
                                  '<tr>'+
                                    '<td class="pad" style="padding-right:10px;width:100%;padding-left:0px;padding-top:60px;">'+
                                      '<div align="center" class="alignment" style="line-height:10px"><img src="https://3csigmawater.com/correos_html/logo1.png" style="display: block; height: auto; border: 0; width: 120px; max-width: 100%;" width="120" /></div>'+
                                    '</td>'+
                                  '</tr>'+
                                '</table>'+
                                '<div class="spacer_block mobile_hide" style="height:25px;line-height:25px;font-size:1px;"></div>'+
                                '<div class="spacer_block" style="height:5px;line-height:5px;font-size:1px;"></div>'+
                              '</td>'+
                            '</tr>'+
                          '</tbody>'+
                      ' </table>'+
                      '</td>'+
                    '</tr>'+
                  '</tbody>'+
                '</table>'+
                '<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">'+
                  '<tbody>'+
                  ' <tr>'+
                      '<td>'+
                      ' <table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 600px;" width="600">'+
                        ' <tbody>'+
                            '<tr>'+
                              '<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">'+
                                '<table border="0" cellpadding="0" cellspacing="0" class="heading_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">'+
                                  '<tr>'+
                                    '<td class="pad" style="padding-top:30px;text-align:center;width:100%;">'+
                                      '<h3 style="margin: 0; color: #000000; direction: ltr; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; font-size: 17px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">¿Tienes dudas?</span></h3>'+
                                    '</td>'+
                                  '</tr>'+
                                '</table>'+
                              ' <table border="0" cellpadding="0" cellspacing="0" class="icons_block block-2" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">'+
                                  '<tr>'+
                                    '<td class="pad" style="vertical-align: middle; color: #000000; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 14px; padding-right: 20px; text-align: center;">'+
                                      '<table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">'+
                                        '<tr>'+
                                          '<td class="alignment" style="vertical-align: middle; text-align: center;">'+
                                            '<!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->'+
                                              '<!--[if !vml]><!-->'+
                                              '<table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;">'+
                                                '<!--<![endif]-->'+
                                                '<tr>'+
                                                  '<td style="vertical-align: middle; text-align: center; padding-top: 10px; padding-bottom: 10px; padding-left: 10px; padding-right: 10px;"><a href="tel:7862387004" style="text-decoration: none;" target="_self"><img align="center" alt="" class="icon" height="16" src="https://3csigmawater.com/correos_html/phone.png" style="display: block; height: auto; margin: 0 auto; border: 0;" width="16" /></a></td>'+
                                                  '<td style="font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 14px; color: #000000; vertical-align: middle; letter-spacing: undefined; text-align: center;"><a href="tel:7862387004" style="color: #000000; text-decoration: none;" target="_self">Llámanos</a></td>'+
                                                '</tr>'+
                                              '</table>'+
                                              '<!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->'+
                                                '<!--[if !vml]><!-->'+
                                                '<table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;">'+
                                                  '<!--<![endif]-->'+
                                                  '<tr>'+
                                                    '<td style="vertical-align: middle; text-align: center; padding-top: 10px; padding-bottom: 10px; padding-left: 10px; padding-right: 10px;"><a href="mailto:sales@3csigmawater.com" style="text-decoration: none;" target="_self"><img align="center" alt="" class="icon" height="16" src="https://3csigmawater.com/correos_html/email.png" style="display: block; height: auto; margin: 0 auto; border: 0;" width="16" /></a></td>'+
                                                    '<td style="font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 14px; color: #000000; vertical-align: middle; letter-spacing: undefined; text-align: center;"><a href="mailto:sales@3csigmawater.com" style="color: #000000; text-decoration: none;" target="_self">Escríbenos</a></td>'+
                                                  '</tr>'+
                                                '</table>'+
                                              '</td>'+
                                            '</tr>'+
                                        '</table>'+
                                        '</td>'+
                                      '</tr>'+
                                    '</table>'+
                                    '<table border="0" cellpadding="0" cellspacing="0" class="social_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">'+
                                      '<tr>'+
                                        '<td class="pad" style="padding-left:10px;text-align:center;padding-right:0px;">'+
                                          '<div class="alignment" style="text-align:center;">'+
                                          ' <table border="0" cellpadding="0" cellspacing="0" class="social-table" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;" width="72px">'+
                                              '<tr>'+
                                                '<td style="padding:0 2px 0 2px;"><a href="https://www.facebook.com/3csigmawater" target="_blank"><img alt="Facebook" height="32" src="https://3csigmawater.com/correos_html/facebook2x.png" style="display: block; height: auto; border: 0;" title="facebook" width="32" /></a></td>'+
                                                '<td style="padding:0 2px 0 2px;"><a href="https://www.instagram.com/3csigmawater/" target="_blank"><img alt="Instagram" height="32" src="https://3csigmawater.com/correos_html/instagram2x.png" style="display: block; height: auto; border: 0;" title="instagram" width="32" /></a></td>'+
                                              '</tr>'+
                                            '</table>'+
                                          '</div>'+
                                      ' </td>'+
                                      '</tr>'+
                                    '</table>'+
                                  '</td>'+
                                '</tr>'+
                              '</tbody>'+
                            '</table>'+
                          '</td>'+
                        '</tr>'+
                      '</tbody>'+
                    '</table>'+
                    '<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">'+
                      '<tbody>'+
                      ' <tr>'+
                          '<td>'+
                            '<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #ffffff; color: #000000; width: 600px;" width="600">'+
                              '<tbody>'+
                                '<tr>'+
                                  '<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">'+
                                    '<div class="spacer_block" style="height:30px;line-height:30px;font-size:1px;"> </div>'+
                                  '</td>'+
                                '</tr>'+
                              '</tbody>'+
                            '</table>'+
                          '</td>'+
                        '</tr>'+
                      '</tbody>'+
                    '</table>'+
                    '<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">'+
                      '<tbody>'+
                        '<tr>'+
                          '<td>'+
                            '<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">'+
                              '<tbody>'+
                                '<tr>'+
                                  '<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">'+
                                    '<table border="0" cellpadding="0" cellspacing="0" class="icons_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">'+
                                    ' <tr>'+
                                        '<td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">'+
                                          '<table cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">'+
                                            '<tr>'+
                                              '<td class="alignment" style="vertical-align: middle; text-align: center;">'+
                                                '<!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->'+
                                                  '<!--[if !vml]><!-->'+
                                                  '<table cellpadding="0" cellspacing="0" class="icons-inner" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;">'+
                                                    '<!--<![endif]-->'+
                                                  '</table>'+
                                              '</td>'+
                                            '</tr>'+
                                          '</table>'+
                                        '</td>'+
                                      '</tr>'+
                                    '</table>'+
                                  '</td>'+
                                '</tr>'+
                              '</tbody>'+
                            '</table>'+
                          '</td>'+
                        '</tr>'+
                      '</tbody>'+
                    '</table>'+
                  '</td>'+
                '</tr>'+
              '</tbody>'+
          ' </table>',
      err: false
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log('\nERROR: ' + error+'\n');
        res.json({ yo: 'error' });
      } else {
        console.log('\nRESPONSE SENT: ' + info.response+'\n');
      }
    });
  
  // ! ****************************************************************************************
    let idConsecutivo = await conexion.query("SELECT id FROM registro_de_vendedores WHERE id_vendedor = ?", [id_vendedor]);
    let fecha = new Date().toLocaleDateString("en-CA");
    const numClientes = 00;
    const idVendedor = idConsecutivo[0].id;
    const datos_PorDefectosCl = { fecha, numClientes, idVendedor };
    await conexion.query("INSERT INTO historialnuevosclientes SET ?", [ datos_PorDefectosCl]);

    let codeAfiliado = await conexion.query("SELECT codigo_afiliado, id_vendedor FROM registro_de_vendedores WHERE id_vendedor = ?",[id_vendedor]);
    codeVendedor = codeAfiliado[0].id_vendedor
    const numAfiliados = 00;
    const datos_PorDefectosAfl = {fecha, numAfiliados: numAfiliados, idVendedor: codeVendedor, };
    await conexion.query("INSERT INTO historialvendedores SET ?", [datos_PorDefectosAfl ]);
    // Insertando datos en la tabla historial ganancias de vendedores
    const dataVentas = { fecha, numVentas: 0, idVendedor: id_vendedor, codigo_afiliado }
    await conexion.query('INSERT INTO historial_numventas SET ?', [dataVentas])
    res.redirect("https://3csigmawater.com");
  };

// todo: ==> Mostrar informacion del vendedor afiliado
  exports.listarAfiliados = async (req, res) => {
    // Capturando el id del Vendedor actual
    const id_vendedorA = req.user.id_vendedor;
    // Consultando en DB los afiliados de ese vendedor
    conexion.query("SELECT rv.*, u.estado_de_la_cuenta FROM registro_de_vendedores rv JOIN usuarios u ON u.id_vendedor = rv.id_vendedor WHERE rv.codigo_afiliado = ?", [id_vendedorA],(err, result) => { 
        if (err) throw err;
        res.render("afiliados", { user: req.user, result: result });
      }
    );
  };

// todo: ==> Mostrar perfil del vendedor
  exports.perfilVendedores = async (req, res) => {
  // Capturando el id del Vendedor actual
    const id_vendedor = req.user.id_vendedor;
  // Consultando en DB los afiliados de ese vendedor

    let fotoUpdate;
    let vendedor = await conexion.query(
      "SELECT * FROM registro_de_vendedores rv JOIN usuarios u ON u.id_vendedor = rv.id_vendedor WHERE rv.id_vendedor =  ?",
      [id_vendedor] );

    if (vendedor.length > 0) {
        vendedor = vendedor[0];
      if (vendedor.foto) {
          fotoUpdate = JSON.parse(vendedor.foto);
          fotoUpdate = fotoUpdate.fotoUser;
      } else {
        fotoUpdate = "../directorio_dash/images/users/userDefault.gif";
      }
    }
    res.render("perfil-vendedor", { user: req.user, vendedor, fotoUpdate });
  };

// todo: ==> Actualizar informacion de vendedor
  exports.editInfo = async (req, res) => {
    const id_vendedor = req.user.id_vendedor;
    let pass = req.body.editPass;
    const fotoUser = "../fotoVendedor/" + urlLicencias[0];
    let foto = JSON.stringify({ fotoUser: fotoUser });

    const vendedor = await conexion.query("SELECT * FROM usuarios WHERE id_vendedor =  ?", [id_vendedor]);
    const passDB = vendedor[0].pass;

      if (pass == "") {
            pass = passDB;
        } else {
            pass = await bcryptjs.hash(pass, 12);
      }

    const fotoDB = vendedor[0].foto;
        if (foto == "") {
              foto = fotoDB;
            } else {
              foto = JSON.stringify({ fotoUser: fotoUser });
      }

    // **** Información personal *****
    const correo = req.body.editCorreo;
    const telefono_movil = req.body.editTel;
    const direccion = req.body.editDire;
    const ciudad = req.body.editCiu;
    const apt_suite_unidad = req.body.editApt;
    const codigo_postal = req.body.editPostal;

    // **** Información bancaria *****
    const nombre_banco = req.body.editBanco;
    const numero_cuenta = req.body.editCuenta;
    const ruta = req.body.editRuta;
    const beneficiario = req.body.editBeneficiario;

    let datos_usuarios = { correo, pass, foto };
    let Datos_personales = { correo, telefono_movil, direccion,ciudad,
      apt_suite_unidad,codigo_postal,nombre_banco, numero_cuenta, ruta,beneficiario, };

    await conexion.query("UPDATE usuarios SET ? WHERE id_vendedor = ?", [ datos_usuarios, id_vendedor, ]);
    await conexion.query("UPDATE registro_de_vendedores SET ? WHERE id_vendedor = ?", [Datos_personales, id_vendedor],(err, result) => {
        if (err) throw err;
        res.redirect("/perfil-vendedor/" + id_vendedor);
      }
    );
  };

// todo: ==> Mostrar tabs de facturas (propias y afiliados)
  exports.facturacion = async (req, res) => {
    const id_vendedorA = req.user.id_vendedor;
    // Consultando en DB las ventas x vendedor
    const allSellers = await conexion.query('SELECT id_vendedor, ventas_individuales, ventas_afiliados, total_ventas, ganancias FROM registro_de_vendedores')
    const ventasVendedor = allSellers.find(i => i.id_vendedor == id_vendedorA)

    const facturacionPropia = await conexion.query('SELECT f.id_factura, f.fecha_instalacion, nc.nombre, nc.apellido, f.producto_instalado, sc.monto_aprobado, f.comision_total, nc.id as idCliente, f.id_cliente as cliente_factura, f.vendedores, f.estadoFactura FROM nuevos_cliente nc JOIN factura f ON nc.id = f.id_cliente JOIN solicitar_credito sc ON nc.id = sc.id_cliente WHERE nc.codigo_id_vendedor = ? ;', [id_vendedorA])
    
    let sumaComisionPropia = 0
    facturacionPropia.forEach(fp => {
        fp.factura = {}
        if (fp.idCliente == fp.cliente_factura) {
            if (fp.estadoFactura == 0) { 
                fp.factura.text = "Pendiente"; 
                fp.factura.color = "badge-soft-warning"; 
                fp.comision = "Por definir"
            } else {
                fp.factura.text = "Pagado"; 
                fp.factura.color = "badge-soft-success";
                const vendedores = JSON.parse(fp.vendedores)
                const v = vendedores.find(i => i.codigo == id_vendedorA)
                fp.comision = v.comision_final
                fp.comision = parseFloat(fp.comision)
                sumaComisionPropia += fp.comision
            }
        }
    });

    const facturacionAfiliado = await conexion.query('SELECT nc.id as idClientenc, f.id_cliente as idClientef, rv.id_vendedor, rv.nombres, nc.nombre, nc.apellido, f.id_factura, f.fecha_instalacion, f.producto_instalado, f.comision_total, f.vendedores, f.estadoFactura, sc.monto_aprobado FROM registro_de_vendedores rv JOIN nuevos_cliente nc ON rv.id_vendedor = nc.codigo_id_vendedor JOIN factura f ON f.id_cliente = nc.id JOIN solicitar_credito sc ON sc.id_cliente = nc.id WHERE codigo_afiliado = ? ;', [id_vendedorA])

    let sumaComisionAfiliados = 0
    facturacionAfiliado.forEach(afl => {
        afl.facturaAfl = {}
        if (afl.idClientenc == afl.idClientef) {
            if (afl.estadoFactura == 0) { 
                afl.facturaAfl.text = "Pendiente"; 
                afl.facturaAfl.color = "badge-soft-warning";
                afl.comision = "Por definir"
            } else {
                afl.facturaAfl.text = "Pagado"; 
                afl.facturaAfl.color = "badge-soft-success";
                const vendedores = JSON.parse(afl.vendedores)
                const v = vendedores.find(i => i.codigo == id_vendedorA)
                afl.comision =  parseFloat(v.comision_final)
                sumaComisionAfiliados += afl.comision
            }
        }
    });

    sumaComisionAfiliados != 0 ? sumaComisionAfiliados = parseFloat(sumaComisionAfiliados).toFixed(1) : sumaComisionAfiliados = 0;
    const totalComisiones = parseFloat(ventasVendedor.ganancias)

    res.render('ventas-vendedor', { user: req.user, facturacionPropia, facturacionAfiliado, ventasVendedor, sumaComisionPropia, sumaComisionAfiliados, totalComisiones })
  }

// todo: ==> Consultar factura para mostrar en el siderbar
  exports.consultarFactura = async (req, res) => {
    const { idFactura } = req.body;
    const facturas = await conexion.query("SELECT * FROM factura");
    const f = facturas.find((i) => i.id_factura == idFactura);

    if (f) {
      const cliente = await conexion.query("SELECT * FROM nuevos_cliente");
      const c = cliente.find((i) => i.id == f.id_cliente);
      f.cliente = {
        nombre: c.nombre + " " + c.apellido,
        telefono: c.telefono,
        direccion: c.direccion,
      };
      f.vendedores = JSON.parse(f.vendedores);
      f.fecha_pago = f.mes + "/" + f.dia + "/" + f.year;

      console.log("\nFACTURA SELECCIONADA >>>>>> ", f);
      if (f.estadoFactura == 1) {
        res.send(f);
      } else {
        res.send(false);
      }
    }
  };