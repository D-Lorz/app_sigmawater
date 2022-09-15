
// todo * * * * * * * * * * * * * * * * * *
// *  ==>> CALENDARIO FECHA ESPECIFICA PARA AGENDAR CITA DE INSTALACIÓN
$.datepicker.regional['es'] = {
        
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthNamesShort: ['Enero','Febrero','Marzo','Abril', 'Mayo','Junio','Julio','Agosto','Septiembre', 'Octubre','Noviembre','Diciembre'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
    dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
    weekHeader: 'Sm',
    dateFormat: 'mm/dd/yy',
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: '',
   
    };
    $.datepicker.setDefaults($.datepicker.regional['es']);

    const dateTodayBirth = new Date();
    const yrRangeBirth = (dateToday.getFullYear() -18);
    const hoyBirth = new Date().getDate();
    $(function () {
    $("#fecha_cita").datepicker({
      yearRange: '1900'+ ":" +yrRangeBirth,
     changeMonth: true,
    changeYear: true,
  });
});