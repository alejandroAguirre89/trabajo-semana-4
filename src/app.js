//requires
require('./config/config')
const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
require('./helpers/helpers');
const session = require('express-session')

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

    console.log(req.session);
    if(req.session.sessionCoordinador || req.session.sessionAspirante )
    {
        resp.locals.session = true
        resp.locals.usuario = req.session.usuario
        resp.locals.nombre  = req.session.nombre
        resp.locals.sessionCoordinador   = req.session.sessionCoordinador
        resp.locals.sessionAspirante     = req.session.sessionAspirante
    }
    
    next()
})

//body parser
app.use(bodyParser.urlencoded({ extended: false }));

//routes
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, (err, result)=> {
    if(err)
        return console.log(err);

    console.log('conectado');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto '+ process.env.PORT);
})