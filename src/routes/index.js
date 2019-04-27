const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const Curso      = require('../models/cursos')
const Aspirante  = require('./../models/aspirantes')
const AspiranteCurso  = require('./../models/aspirantes-curso')
const bcrypt = require('bcrypt')
const multer  = require('multer')
const funciones = require('../funciones/funciones');

app.set('view engine', 'hbs');

//var upload = multer({ dest: 'uploads/' })

const dirViews    = path.join(__dirname,'../../template/views');
const dirPartials = path.join(__dirname, '../../template/partials');

app.set('views', dirViews)
hbs.registerPartials(dirPartials)

app.get('/', (req, res) => {
    if(req.session.sessionActiva)
    {
        funciones.buscarAspirantePorEmail(req.session.usuario.correo, function (aspirante){
            
            let avatar = ''

            if(aspirante.avatar)
                avatar = aspirante.avatar.toString('base64') 

            res.render('index', {
                tituloPagina: 'Inicio',
                nombre: req.session.nombre,
                mostrar: req.session.nombre,
                // variables de sesion
                sessionActiva:      req.session.sessionActiva,
                sessionAspirante:   req.session.sessionAspirante,
                sessionCoordinador: req.session.sessionCoordinador,
                nombre: req.session.nombre,
                avatar: avatar,
            });
        })

    }
    else
    {
        res.render('index'),{
            tituloPagina: 'Inicio',
        };
    }
});

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'public/uploads')
//     },
//     filename: function (req, file, cb) {
//         cb(null, req.body.nroDocumento+ '-' +file.originalname)
//     }
// })
 
//var upload = multer({ storage: storage })
var upload = multer({})

app.post('/registro', upload.single('fotoPerfil'), (req,res) => {

    let archivo = null

    if(req.file != null)
        archivo = req.file.buffer

    let aspirante = new Aspirante({
        nroDocumento: req.body.nroDocumento,
        nombre: req.body.nombre,
        correo: req.body.correo,
        contrasena: bcrypt.hashSync(req.body.contrasena, 10),
        avatar: archivo,
        rol: 'aspirante'
    })
    
    aspirante.save((err, result) =>{
        if(err)
        {
            return res.render('index', {
                mostrar: err,
            })
        }

        // variables de sesión
        req.session.usuario = result
        req.session.nombre  = result.nombre
        req.session.sessionActiva        = true
        req.session.sessionAspirante     = true
        req.session.sessionCoordinador   = false

        let avatar = ''
        if(result.avatar)
            avatar = result.avatar.toString('base64')

        res.render('index', {
            tituloPagina: 'Inicio',
            nombre: req.session.nombre,
            mostrar: req.session.nombre,
            // variables de sesion
            sessionActiva:      req.session.sessionActiva,
            sessionAspirante:   req.session.sessionAspirante,
            sessionCoordinador: req.session.sessionCoordinador,
            nombre: req.session.nombre,
            avatar: avatar
        });
    })
});

app.post('/identificarse', (req,res) => {

    Aspirante.findOne({correo: req.body.correo}, (err, result) =>{
        if(err)
        {
            return res.render('index', {
                mostrar: err
            })
        }
        
        if(!result)
        {
            return res.render('index', {
                mostrar: 'Usuario o contraseña invalido'
            })
        }

        if(!bcrypt.compareSync(req.body.contrasena, result.contrasena))
        {
            return res.render('index', {
                mostrar: 'Usuario o contraseña invalido'
            })
        }

        // variables de sesión
        req.session.usuario = result
        req.session.nombre  = result.nombre
        req.session.sessionActiva = true

        let avatar = '';
        if(result.avatar)
            avatar = result.avatar.toString('base64')

        switch (result.rol) {
            case 'coordinador':
                req.session.sessionCoordinador = true
                break;
            default:
                req.session.sessionAspirante  = true
                break;
        }

        res.render('index', {
            tituloPagina: 'Inicio',
            nombre: req.session.nombre,
            mostrar: result.nombre,
            // variables de sesion
            sessionActiva:      req.session.sessionActiva,
            sessionAspirante:   req.session.sessionAspirante,
            sessionCoordinador: req.session.sessionCoordinador,
            nombre: req.session.nombre,
            avatar: avatar
        });
    })
});

app.get('/salir', (req,res) =>{

    //variables de sesion
    req.session.destroy((err) => {
        console.log(err);
    })

    return res.redirect('/');
});

app.get('/listarcursos', (req, res) => {

    Curso.find({}).exec((err, resp) => {
        if(err)
            return console.log(err);

        res.render('listar-cursos', {
            tituloPagina: 'Lista de cursos',
            listado: resp,
        });
    })
});

app.post('/cambiarEstadoCurso', (req,res) =>{

    console.log(req.body);

    Curso.findOneAndUpdate({_id: req.body.id}, req.body, {new: true, runValidators: true, context: 'query' } ,(err, result) =>{
        
        let mostrar = 'Estado del curso actualizado exitosamente'

        if(err)
            mostrar = err
        
        if(result == null)
            mostrar = 'No se encontro el curso'

        Curso.find({}).exec((err, resp) => {
            if(err)
                return console.log(err);
    
            res.render('listar-cursos', {
                mostrar: mostrar,
                tituloPagina: 'Lista de cursos',
                listado: resp,
            });
        })
    })
});

app.get('/vercursos', (req, res) => {

    Curso.find({estado: 'disponible'}).exec((err, resp) => {
        if(err)
            return console.log(err);

        funciones.buscarAspirantePorEmail(req.session.usuario.correo, function (aspirante){

            let avatar = ''

            if(aspirante.avatar)
                avatar = aspirante.avatar.toString('base64') 

            res.render('ver-cursos', {
                tituloPagina: 'Ver cursos disponibles',
                nombre: req.session.nombre,
                avatar: avatar,
                listado: resp
            })
        })
    })
});

app.get('/crearcurso', (req,res) =>{
    res.render('crear-curso', {
        tituloPagina: 'Crear curso',
        respuesta: true,
    });
});

app.post('/crearcurso', (req,res) =>{

    let curso = new Curso({
        nombre: req.body.nombrecurso,
        modalidad:         req.body.modalidadcurso,
        valor:             req.body.valorcurso,
        descripcion:       req.body.descripcioncurso,
        intensidadHoraria: req.body.intensidadhorariacurso,
        estado:            'disponible'
    })
    
    curso.save((err, respuesta) =>{       

        if(err)
        {
            console.log(err);
        }

        return res.redirect('/listarcursos');
    })
});

app.get('/inscripcioncurso', (req,res) =>{

    Curso.find({estado: 'disponible'}).exec((err, listado) => {
        if(err)
            return console.log(err);

        funciones.buscarAspirantePorEmail(req.session.usuario.correo, function (aspirante){

            let avatar = ''

            if(aspirante.avatar)
                avatar = aspirante.avatar.toString('base64') 

            res.render('inscripcion-curso', {
                tituloPagina: 'Incripción en curso',
                listado: listado,
                nroDocumento: req.session.usuario.nroDocumento,
                nombre: req.session.usuario.nombre,
                correo: req.session.usuario.correo,
                avatar: avatar,
            })
        })
    });
});

app.post('/inscripcioncurso', (req,res) =>{

    let aspiranteCurso = new AspiranteCurso({
        nroDocumento:   req.session.usuario.nroDocumento,
        nombre:         req.session.usuario.nombre,
        correo:         req.session.usuario.correo,
        telefono:       req.body.telefonoaspirante,
        idAspirante:     req.session.usuario._id,
        idCurso:        req.body.curso
    })

    AspiranteCurso.findOne({idAspirante: req.session.usuario._id, idCurso: req.body.curso }).exec((err, result) => {
        
        let resp = true

        if(err)
            resp = false

        if(result != null)
        {
            Curso.find({estado: 'disponible'}).exec((err, listado) => {

                if(err)
                    console.log(err)
                
                funciones.buscarAspirantePorEmail(req.session.usuario.correo, function (aspirante){
    
                    let avatar = ''
        
                    if(aspirante.avatar)
                        avatar = aspirante.avatar.toString('base64') 
    
                    res.render('inscripcion-curso', {
                        tituloPagina: 'Incripción en curso',
                        respuesta: false,
                        listado: listado,
                        nroDocumento: req.session.usuario.nroDocumento,
                        nombre: req.session.usuario.nombre,
                        correo: req.session.usuario.correo,
                        avatar: avatar
                    })
                })
            })
        }
        else
        {
            aspiranteCurso.save((err, respuesta) => {  
        
                let resp = true
        
                if(err)
                {
                    resp = false
                    console.log(err)
                }
        
                Curso.find({estado: 'disponible'}).exec((err, listado) => {
                    if(err)
                        return console.log(err);
            
                    funciones.buscarAspirantePorEmail(req.session.usuario.correo, function (aspirante){
        
                        let avatar = ''
            
                        if(aspirante.avatar)
                            avatar = aspirante.avatar.toString('base64') 
        
                        res.render('inscripcion-curso', {
                            tituloPagina: 'Incripción en curso',
                            respuesta: resp,
                            listado: listado,
                            nroDocumento: req.session.usuario.nroDocumento,
                            nombre: req.session.usuario.nombre,
                            correo: req.session.usuario.correo,
                            avatar: avatar
                        })
                    })
                })
            })
        }
    })
});

app.get('/vercursosinscritos', (req, res) => {

    AspiranteCurso.find({idAspirante: req.session.usuario._id}).exec((err, listaCursosApirante) => {
        if(err)
            return console.log(err);

        let arrayIdCursosInscritos = []

        listaCursosApirante.forEach(function(cursoApirante) {
            arrayIdCursosInscritos.push(cursoApirante.idCurso);
        })   

        Curso.find({_id: arrayIdCursosInscritos}).exec((err, listadoCursosInscritos) => {
            
            if(err)
                return console.log(err);

            funciones.buscarAspirantePorEmail(req.session.usuario.correo, function (aspirante){

                let avatar = ''

                if(aspirante.avatar)
                    avatar = aspirante.avatar.toString('base64') 

                res.render('ver-cursos-inscritos', {
                    tituloPagina: 'Ver cursos inscritos',
                    nombre: req.session.nombre,
                    avatar: avatar,
                    listado: listadoCursosInscritos
                })
            })
        })
    })
});

app.post('/cancelarcurso', (req,res) =>{

    AspiranteCurso.findOneAndDelete({idCurso: req.body.idCurso, idAspirante: req.session.usuario._id}, req.body, (err, result) =>{
        if(err)
            console.log(err)
        
        if(!result)
            mostrar = 'No se encontro el curso del estudiante a cancelar'
        
        else 
        {
            return res.redirect('/vercursosinscritos');
        }
    })
});

app.get('/listaraspirantesinscritos', (req, res) => {

    funciones.obtenerApirantesPorCurso(function (listadoCursos){

        res.render('listar-inscritos', {
            tituloPagina: 'Ver aspirantes inscritos',
            respuesta: 0,
            listadoCursos: listadoCursos,
        })
    })
});

app.post('/eliminarAspiranteCurso', (req,res) =>{

    AspiranteCurso.findOneAndDelete({idCurso: req.body.idCurso, idAspirante: req.body.idAspirante}, req.body, (err, result) =>{
        if(err)
            console.log(err)
        
        if(!result)
            console.log('No se encontro el curso del estudiante a cancelar')
        
        return res.redirect('/listaraspirantesinscritos');
    })
});

app.get('/salachat', (req, res) => {
    if(req.session.sessionActiva)
    {
        funciones.buscarAspirantePorEmail(req.session.usuario.correo, function (aspirante){
            
            let avatar = ''

            if(aspirante.avatar)
                avatar = aspirante.avatar.toString('base64') 

            res.render('sala-chat', {
                tituloPagina: 'Sala de chat',
                nombre: req.session.nombre,
                mostrar: req.session.nombre,
                // variables de sesion
                sessionActiva:      req.session.sessionActiva,
                sessionAspirante:   req.session.sessionAspirante,
                sessionCoordinador: req.session.sessionCoordinador,
                nombre: req.session.nombre,
                avatar: avatar,
            });
        })

    }
    else
    {
        res.render('sala-chat'),{
            tituloPagina: 'Sala de chat',
        };
    }
});

app.get('/registrocoordinador', (req, res) => {
    if(req.session.sessionActiva)
    {
        res.render('crear-coordinador', {
            tituloPagina: 'Registrar coordinador',
            respuesta: false
        });
    }
    else
        return res.redirect('/');
});

app.post('/registrocoordinador', upload.single('fotoPerfil'), (req,res) => {

    let archivo = null

    if(req.file != null)
        archivo = req.file.buffer

    let coordinador = new Aspirante({
        nroDocumento: req.body.nroDocumento,
        nombre: req.body.nombre,
        correo: req.body.correo,
        contrasena: bcrypt.hashSync(req.body.contrasena, 10),
        avatar: archivo,
        rol: 'coordinador'
    })
    
    coordinador.save((err, result) =>{
        if(err)
            console.log(err);

        res.render('crear-coordinador', {
            tituloPagina: 'Registrar coordinador',
            respuesta: true
        });
    })
});
  
app.get('*', (req,res) =>{
    res.render('error');
});

module.exports = app