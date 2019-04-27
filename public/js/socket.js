socket = io()

const formulario = document.querySelector('#formulario')
const usuario = document.querySelector('#usuario')
const mensaje = formulario.querySelector('#texto')
const chat = document.querySelector('#chat')

// socket.on("connect",() =>{
// 	console.log(usuario)
// 	socket.emit('usuarioNuevo', usuario)

// })
socket.emit('usuarioNuevo', usuario.value)

socket.on('nuevoUsuario', (texto) =>{

    let d = new Date();
    let contenido = `<div class="row d-flex justify-content-center mt-1">
                        <div class="col-md-6">
                            <div class="alert alert-success text-center">
                                ${texto}
                                <small class="d-flex justify-content-center">${d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()}</small>
                            </div>
                        </div>
                    </div>`;

	chat.innerHTML  = chat.innerHTML + contenido
})

socket.on('usuarioDesconectado', (texto) =>{
    
    let d = new Date();
    let contenido = `<div class="row d-flex justify-content-center mt-1">
                        <div class="col-md-6">
                            <div class="alert alert-danger text-center">
                                ${texto}
                                <small class="d-flex justify-content-center">${d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()}</small>
                            </div>
                        </div>
                    </div>`;

	chat.innerHTML  = chat.innerHTML + contenido
})

formulario.addEventListener('submit', (datos) => {	
	datos.preventDefault()
	socket.emit('texto', mensaje.value, () => {			
			mensaje.value = ''
			mensaje.focus()
			}
		)
})

socket.on("texto", (objeto) =>{

    let claseCssOrientacion = 'justify-content-end' 
    let claseCssMensaje = 'alert-secondary' 

    if(objeto.nombreUsuario == usuario.value)
    {
        claseCssOrientacion = 'justify-content-left'
        claseCssMensaje = 'alert-primary'
    }

    let d = new Date();
    let contenido = `<div class="row d-flex ${claseCssOrientacion} mt-1">
                    <div class="col-md-6">
                        <div class="alert ${claseCssMensaje} text-center">
                            ${objeto.texto}
                            <small class="d-flex justify-content-end">${d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()}</small>
                        </div>
                    </div>
                </div>`;

	chat.innerHTML  = chat.innerHTML + contenido
})