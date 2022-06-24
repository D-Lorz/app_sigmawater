/*
Template Name: Minia - Admin & Dashboard Template
Author: Themesbrand
Website: https://themesbrand.com/
Contact: themesbrand@gmail.com
File: Sweatalert Js File
*/




//Ajax
document.getElementById("ajax-alert").addEventListener("click", function() {
    Swal.fire({
        title: 'Submit email to run ajax request',
        input: 'number',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true,
        confirmButtonColor: "#5156be",
        cancelButtonColor: "#fd625e",
        preConfirm: function (email) {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    if (email === 'j@gmail.com') {
                        reject('ready')
                    } else {
                        resolve()
                    }
                }, 2000)
            })
        },
        allowOutsideClick: false
    }).then(function (email) {
        Swal.fire({
            icon: 'success',
            title: 'Ajax request finished!',
            confirmButtonColor: "#5156be",
            html: 'Submitted email: ' + email
        })
    })
});
