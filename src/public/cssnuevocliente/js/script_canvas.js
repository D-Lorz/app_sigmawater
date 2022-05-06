let canvas = document.querySelector("#canvas");
let btnLimpiar = document.getElementById("btnLimpiar");
let ctx = canvas.getContext("2d");
let cw = (canvas.width = 300), cx = cw / 2;
let ch = (canvas.height = 150), cy = ch / 2;
ctx.strokeStyle = "#000";
let dibujando = false;
let m = { x: 0, y: 0 };

let eventsRy = [{event:"mousedown",func:"onStart"}, 
                {event:"touchstart",func:"onStart"},
                {event:"mousemove",func:"onMove"},
                {event:"touchmove",func:"onMove"},
                {event:"mouseup",func:"onEnd"},
                {event:"touchend",func:"onEnd"},
                {event:"mouseout",func:"onEnd"}
               ];

function onStart(evt) {
  m = oMousePos(canvas, evt);
  ctx.beginPath();
  dibujando = true;
}

function onMove(evt) {
  if (dibujando) {
    ctx.moveTo(m.x, m.y);
    m = oMousePos(canvas, evt);
    ctx.lineTo(m.x, m.y);
    ctx.stroke();
  }
}

function onEnd(evt) {
  dibujando = false;
}

function oMousePos(canvas, evt) {
  let ClientRect = canvas.getBoundingClientRect();
  let e = evt.touches ? evt.touches[0] : evt;

    return {
      x: Math.round(e.clientX - ClientRect.left),
      y: Math.round(e.clientY - ClientRect.top)
    };
}

for (let i = 0; i < eventsRy.length; i++) {
  (function(i) {
      let e = eventsRy[i].event;
      let f = eventsRy[i].func;console.log(f);
      canvas.addEventListener(e, function(evt) {
            evt.preventDefault();
            window[f](evt);
            return;
        },false);
  })(i);
}

btnLimpiar.addEventListener("click", function() {
    ctx.clearRect(0, 0, cw, ch);
  },false
);

/** VALIDACIONES ÚLTIMO PASO DE REGISTRO NUEVO CLIENTE */
let btnAceptar = document.getElementById("btnAceptar");
let btnSgte = document.getElementById("btnSiguienteFirmado");
let code_base64 = document.getElementById("code_base64");
let inputFirma = document.getElementById("miFirma_png");

// Acciones al dar clic en el botón siguiente del modal de la firma
btnSgte.addEventListener("click", function() {
    if (isCanvasEmpty(canvas)) {
        btnAceptar.checked = false;
        code_base64.value = '';
        inputFirma.value = '';
    } else {
        $('#modalFirmar').hide();
        btnAceptar.checked = true;
        // Convertir la imagen a Base64 y ponerlo en el input oculto
        code_base64.value = canvas.toDataURL();
        inputFirma.value = "Mi_Firma.png";
    }
})

/* VALIDACIONES DEL CANVAS */
function isCanvasEmpty(cnv) {
    const blank = document.createElement('canvas');

    blank.width = cnv.width;
    blank.height = cnv.height;

    return cnv.toDataURL() === blank.toDataURL();
}

/* FIN DE VALIDACIONES CANVAS */