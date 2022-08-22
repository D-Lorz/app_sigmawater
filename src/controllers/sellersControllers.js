const conexion = require("../database/db");

// todo: GENERADOR DE CODIGO DE VENDEDOR APHANUMERICO
const generateRandomString = (num) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result1 = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
        result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result1;

}

// todo: REGISTRAR VENDEDOR 
exports.registrar = async (req, res) => {
    //  ? NOTA: ==>> Esta es la forma para obtener el año actual <<<<<
    const year = new Date().getFullYear();
    //  ? NOTA: ==>> Esta es la forma para obtener el año actual <<<<<
    let mes = new Date().getMonth()
    mes == 0 ? mes = 12 : mes = mes + 1
    //  ? NOTA: ==>> Esta es la forma para obtener el numero de la semana actual del año entero <<<<<
    currentdate = new Date();
    const oneJan = new Date(currentdate.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
    const semana = Math.ceil((currentdate.getDay() + numberOfDays) / 7) - 1;
    console.log("ESTA ES LA SEMANA ACTUAL ==>> ", semana);
    //  ? NOTA: ==>> Esta es la forma para obtener la fecha actual <<<<<
    const dia = new Date().getDate();

    const nombres = req.body.nombres
    const apellidos = req.body.apellidos
    const fecha_nacimiento = req.body.fecha_nacimiento
    const telefono_movil = req.body.telefono_movil
    const correo = req.body.correo
    const seguro_social = req.body.seguro_social
    const ciudad = req.body.ciudad
    const direccion = req.body.direccion
    const apt_suite_unidad = req.body.apt_suite_unidad
    const codigo_postal = req.body.codigo_postal
    const codigo_afiliado = req.body.codigo_afiliado
    const nombre_banco = req.body.nombre_banco
    const numero_cuenta = req.body.numero_cuenta
    const ruta = req.body.ruta
    const beneficiario = req.body.beneficiario
    const frontal = '../licences/' + urlLicencias[0]
    const trasera = '../licences/' + urlLicencias[1]
    const licencia_conduccion = JSON.stringify({ 'frontal': frontal, 'trasera': trasera });
    const id_vendedor = generateRandomString(6)
    const pass = "$2a$12$msXcGKVUSc2qWc6d5TPZtOOByPNy0Vk6387rE6GyvtMLdIBRwqjhC"

    const nuevoRegistro = {
        year, mes, semana, dia, nombres, apellidos, fecha_nacimiento, telefono_movil,
        correo, seguro_social, ciudad, direccion, apt_suite_unidad, codigo_postal, codigo_afiliado,
        nombre_banco, numero_cuenta, ruta, beneficiario, licencia_conduccion, id_vendedor
    }
    const usuarios = { correo, pass, id_vendedor, codigo_afiliado }

    await conexion.query('INSERT INTO usuarios SET ?', [usuarios])
    await conexion.query('INSERT INTO registro_de_vendedores SET ?', [nuevoRegistro])
    let idConsecutivo = await conexion.query('SELECT id FROM registro_de_vendedores WHERE id_vendedor = ?', [id_vendedor])

    let fecha = new Date().toLocaleDateString("en-CA");
    const numClientes = 00
    const idVendedor = idConsecutivo[0].id
    console.log("*************");
    console.log("FECHA ==XXX", fecha);
    console.log("numClientes ==XXX", numClientes);
    console.log("idVendedor ==XXX", idVendedor);
    console.log("*************");
    const datos_PorDefectosCl = { fecha, numClientes, idVendedor }
    console.log("DATOS XXXXX", datos_PorDefectosCl);
    await conexion.query('INSERT INTO historialnuevosclientes SET ?', [datos_PorDefectosCl])

    let codeAfiliado = await conexion.query('SELECT codigo_afiliado, id_vendedor FROM registro_de_vendedores WHERE id_vendedor = ?', [id_vendedor])
    let fechas = new Date().toLocaleDateString("en-CA");
    const numAfiliados = 00
    const datos_PorDefectosAfl = { fecha: fechas, numAfiliados: numAfiliados, idVendedor: codeAfiliado[0].id_vendedor }
    console.log("DATOS XXXXX", datos_PorDefectosAfl);

    await conexion.query('INSERT INTO historialvendedores SET ?', [datos_PorDefectosAfl])
    res.redirect('https://3csigmawater.com')
}

// todo: MOSTRAR LISTA DE VENDEDORES AFILIADOS
exports.listarAfiliados = async (req, res) => {
    // Capturando el id del Vendedor actual
    const id_vendedorA = req.user.id_vendedor;
    // Consultando en DB los afiliados de ese vendedor
    conexion.query('SELECT * FROM registro_de_vendedores WHERE codigo_afiliado = ?', [id_vendedorA], (err, result) => {
        if (err) throw err;
        res.render('afiliados', { user: req.user, result: result })
        //    console.log(result);
    })
}

// todo: PERFIL VENDEDORES
exports.perfilVendedores = async (req, res) => {
    res.render('perfil-vendedor', { user: req.user })
}

// todo: MOSTRAR TABS DE VENTAS PROPIAS
exports.facturacion = async (req, res) => {
    const id_vendedorA = req.user.id_vendedor;
    // Consultando en DB los clientes que pertenecen al vendedor actual
    conexion.query('SELECT * FROM registro_de_vendedores WHERE codigo_afiliado = ?', [id_vendedorA])

    const facturacionPropia = await conexion.query('SELECT f.id_factura, f.fecha_instalacion, nc.nombre, nc.apellido, f.producto_instalado, sc.monto_aprobado, f.comision_total, nc.id as idClientenc, f.id_cliente as idClientef, f.estadoFactura as estadoFacturaf  FROM nuevos_cliente nc JOIN factura f ON nc.id = f.id_cliente JOIN solicitar_credito sc ON nc.id = sc.id_cliente WHERE nc.codigo_id_vendedor = ? ;', [id_vendedorA])
    facturacionPropia.forEach(cl => {
        cl.factura = {}
        if (cl.idClientenc = cl.idClientef) {
            if (cl.estadoFacturaf == 0) { cl.factura.text = "Pendiente"; cl.factura.color = "badge-soft-warning"; }
            if (cl.estadoFacturaf == 1) { cl.factura.text = "Pagado"; cl.factura.color = "badge-soft-success"; }
        }
    });

    const facturacionAfiliado = await conexion.query('SELECT nc.id as idClientenc, f.id_cliente as idClientef, rv.id_vendedor, rv.nombres, nc.nombre, nc.apellido, f.id_factura, f.fecha_instalacion, f.producto_instalado, f.comision_total, f.estadoFactura as estadoFacturaf, sc.monto_aprobado FROM registro_de_vendedores rv JOIN nuevos_cliente nc ON rv.id_vendedor = nc.codigo_id_vendedor JOIN factura f ON f.id_cliente = nc.id JOIN solicitar_credito sc ON sc.id_cliente = nc.id WHERE codigo_afiliado = ? ;', [id_vendedorA])
    facturacionAfiliado.forEach(afl => {
        afl.facturaAfl = {}
        if (afl.idClientenc = afl.idClientef) {
            if (afl.estadoFacturaf == 0) { afl.facturaAfl.text = "Pendiente"; afl.facturaAfl.color = "badge-soft-warning"; }
            if (afl.estadoFacturaf == 1) { afl.facturaAfl.text = "Pagado"; afl.facturaAfl.color = "badge-soft-success"; }
        }
    });

    console.log("\nFACTURA PROPIA >> ", facturacionPropia)
    console.log("\nFACTURA AFILIADOS >> ", facturacionAfiliado)

    res.render('ventas-vendedor', { user: req.user, facturacionPropia, facturacionAfiliado })

}