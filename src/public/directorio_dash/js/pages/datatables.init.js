/*
Template Name: Minia - Admin & Dashboard Template
Author: Themesbrand
Website: https://themesbrand.com/
Contact: themesbrand@gmail.com
File: Datatables Js File
*/




$(document).ready(function() {
    $('#').DataTable();

    //Buttons examples
    var table = $('#copyahorro').DataTable({
        lengthChange: false,
        buttons: ['copy', 'excel', 'pdf']
    });

    table.buttons().container()
        .appendTo('#copyahorro_wrapper .col-md-6:eq(0)');

    $(".dataTables_length select").addClass('form-select form-select-sm');
});



$(document).ready(function() {
    $('#datatable').DataTable();

    //Buttons examples
    var table = $('#idahorro').DataTable({
        lengthChange: false,
        buttons: ['copy', 'excel']
    });

    table.buttons().container()
        .appendTo('#idahorro_wrapper .col-md-6:eq(0)');

    $(".dataTables_length select").addClass('form-select form-select-sm');
});

$(document).ready(function() {
   

    //Buttons examples
    var table = $('#clientela').DataTable({
        lengthChange: false,
        buttons: ['copy', 'excel','pdf']
    });

    table.buttons().container()
        .appendTo('#clientela_wrapper .col-md-6:eq(0)');

    $(".dataTables_length select").addClass('form-select form-select-sm');
});

