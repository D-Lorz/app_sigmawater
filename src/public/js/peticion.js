

function EstadoVendor() { 

const estado = $("#selectEstado option:selected").val()
fetch('/perfil-vendedores', { 

    method:'POST',
    body: JSON.stringify({estado}),
    headers: {'Content-Type': 'application/json'}
}).then(res => res.json())
    .catch(error => console.error('Error', error))
    .then(response => {
        if(response)   {

        }
    })

}