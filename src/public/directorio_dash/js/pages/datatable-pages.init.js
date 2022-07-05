/*
Template Name: Minia - Admin & Dashboard Template
Author: Themesbrand
Website: https://themesbrand.com/
Contact: themesbrand@gmail.com
File: datatable for pages Js File
*/


// datatable
$(document).ready(function() {
    $('.datatable').DataTable({
        responsive: false,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
        }
    });
    $(".dataTables_length select").addClass('form-select form-select-sm');
});