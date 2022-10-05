// todo * * * * * * * * * * * * * * * * * *
// *  ==>> Mascara para la coma en los montos 

document.addEventListener("DOMContentLoaded", function () {
    // Pattern (Phone)
    let currencyMask = IMask(document.getElementById('monto-financiar'), {
       mask: '$num',
       blocks: {
         num: {
           // nested masks are available!
           mask: Number,
           thousandsSeparator: ','
         }
       }
     });
   
      
      let currencyMaskk = IMask(document.getElementById('salario-mensual'), {
        mask: '$num',
        blocks: {
          num: {
            // nested masks are available!
            mask: Number,
            thousandsSeparator: ','
          }
        }
      });

    let currencyMasks = IMask(document.getElementById('ingresos-adicionales1'), {
        mask: '$num',
        blocks: {
          num: {
            // nested masks are available!
            mask: Number,
            thousandsSeparator: ','
          }
        }
      });

        //-------> MASCARA PARA EL CAMPO SALARIO MENSUAL //FIXME: SALARIO MENSUALES DE CO-SOLICITANTE
  let currencyMasksalario = IMask(document.getElementById('currency-masksalario'), {
    mask: '$num',
    blocks: {
      num: {
        // nested masks are available!
        mask: Number,
        thousandsSeparator: ','
      }
    }
  });

    //-------> MASCARA PARA EL CAMPO INGRESO ADICIONAL//FIXME:  CO-SOLICITANTE
    let currencyMaskingresosadi = IMask(document.getElementById('currency-maskingresoadi'), {
        mask: '$num',
        blocks: {
          num: {
            // nested masks are available!
            mask: Number,
            thousandsSeparator: ','
          }
        }
      });
    });

document.addEventListener("DOMContentLoaded", function () {
        // =========>>  mascara para agua embotellada  -->
         let currencyMaskAgua = IMask(document.getElementById('agua'), {
           mask: '$num',
           blocks: {
             num: {
               // nested masks are available!
               mask: Number,
               thousandsSeparator: ','
             }
           }
         });
         // =========>>  mascara para Jabones  -->
         let currencyMaskJabones = IMask(document.getElementById('jabones'), {
           mask: '$num',
           blocks: {
             num: {
               // nested masks are available!
               mask: Number,
               thousandsSeparator: ','
             }
           }
         });
       // =========>>  mascara para Productos de limpieza -->
         let currencyMaskpLimpieza = IMask(document.getElementById('pLimpieza'), {
           mask: '$num',
           blocks: {
             num: {
               // nested masks are available!
               mask: Number,
               thousandsSeparator: ','
             }
           }
         });
       
         // =========>>  mascara para agua caliente-->
         let currencyMaskaguaCaliente = IMask(document.getElementById('aguaCaliente'), {
           mask: '$num',
           blocks: {
             num: {
               // nested masks are available!
               mask: Number,
               thousandsSeparator: ','
             }
           }
         });
       
         // =========>>  mascara para plomeria y electrodomésticos-->
         let currencyMaskplomElectro = IMask(document.getElementById('plomElectro'), {
           mask: '$num',
           blocks: {
             num: {
               // nested masks are available!
               mask: Number,
               thousandsSeparator: ','
             }
           }
         });
       
           // =========>>  mascara para Ropa y lenceria -->
           let currencyMaskropa = IMask(document.getElementById('ropa'), {
           mask: '$num',
           blocks: {
             num: {
               // nested masks are available!
               mask: Number,
               thousandsSeparator: ','
             }
           }
         });
        });
        

      
