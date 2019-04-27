//requires
require('./config/config')
const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
require('./helpers/helpers');
const session = require('express-session')
//sockets
const server = require('http').createServer(app);
const io = require('socket.io')(server);

//paths
const dirPublic = path.join(__dirname, '../public')
const dirNode_modules = path.join(__dirname, '../node_modules')

//static
app.use(express.static(dirPublic))
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'))
app.use('/js', express.static(dirNode_modules + '/jquery/dist'))
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'))
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'))

//configuración de variables de sesión
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

//middleware
app.use((req, resp, next) => {

    if(req.session.sessionCoordinador || req.session.sessionAspirante )
    {
        resp.locals.usuario = req.session.usuario
        resp.locals.nombre  = req.session.nombre
        resp.locals.sessionActiva        = req.session.sessionActiva
        resp.locals.sessionCoordinador   = req.session.sessionCoordinador
        resp.locals.sessionAspirante     = req.session.sessionAspirante
    }

    next()
})

//body parser
app.use(bodyParser.urlencoded({ extended: false }));

//routes
app.use(require('./routes/index'));

//conexión bd
mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (err, result)=> {
    if(err)
        return console.log(err);

    console.log('conectado');
});

//sockets
const { Usuarios } = require('./clases/usuarios');
const usuarios = new Usuarios();

io.on('connection', client => {

    /*emite a todos los usuarios cuando un usuario
    se conecta a la sala de chat*/
    client.on('usuarioNuevo', (usuario) =>{
		let listado = usuarios.agregarUsuario(client.id, usuario)
		console.log(listado)
		let texto = `Se ha conectado ${usuario}`
		io.emit('nuevoUsuario', texto )
	})

    /*emite a todos los usuarios cuando un usuario
    se desconecta a la sala de chat*/
	client.on('disconnect',()=>{
        let usuarioBorrado = usuarios.borrarUsuario(client.id)
        let texto = ''

        if(usuarioBorrado)
            texto = `Se ha desconectado ${usuarioBorrado.nombre}`
        
		io.emit('usuarioDesconectado', texto)
	})

    /*emite a todos los usuarios cuando un usuario
    envia un mensaje*/
	client.on("texto", (text, callback) =>{
        let usuario = usuarios.getUsuario(client.id)
        
        let nombreUsuario = usuario.nombre
		let texto = `${nombreUsuario} : ${text}`
		
		io.emit("texto", ({
            nombreUsuario: nombreUsuario,
            texto: texto
        }))
		callback()
    })
});

//puerto
server.listen(process.env.PORT, () => {
    console.log('Escuchando puerto '+ process.env.PORT);
})