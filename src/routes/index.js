const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const Curso      = require('../models/cursos')
const Aspirante  = require('./../models/aspirantes')
const AspiranteCurso  = require('./../models/aspirantes-curso')
const bcrypt = require('bcrypt')

app.set('view engine', 'hbs');

const dirViews    = path.join(__dirname,'../../template/views');
const dirPartials = path.join(__dirname, '../../template/partials');

app.set('views', dirViews)
hbs.registerPartials(dirPartials)

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/registro', (req,res) => {
    let aspirante = new Aspirante({
        nroDocumento: req.body.nroDocumento,
        nombre: req.body.nombre,
        correo: req.body.correo,
        contrasena: bcrypt.hashSync(req.body.contrasena, 10),
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
        req.session.sessionAspirante     = true
        req.session.sessionCoordinador   = false
        console.log(req.session)

        res.render('index', {
            mostrar: 'Bienvenido: '+req.session.nombre,
            // variables de sesion
            sessionAspirante:   req.session.sessionAspirante,
            sessionCoordinador: req.session.sessionCoordinador,
            nombre: req.session.nombre
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

        switch (result.rol) {
            case 'coordinador':
                req.session.sessionCoordinador = true
                break;
            default:
                req.session.sessionAspirante  = true
                break;
        }

        res.render('index', {
            mostrar: 'Bienvenido: '+result.nombre,
            // variables de sesion
            sessionAspirante:   req.session.sessionAspirante,
            sessionCoordinador: req.session.sessionCoordinador,
            nombre: req.session.nombre
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
            listado: resp,
        });
    })
});

app.get('/vercursos', (req, res) => {

    Curso.find({estado: 'disponible'}).exec((err, resp) => {
        if(err)
            return console.log(err);

        res.render('ver-cursos', {
            listado: resp,
        });
    })
});

app.get('/crearcurso', (req,res) =>{
    res.render('crear-curso', {
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

    Curso.find({estado: 'disponible'}).exec((err, resp) => {
        if(err)
            return console.log(err);

        res.render('inscripcion-curso', {
            listado: resp,
            nroDocumento: req.session.usuario.nroDocumento,
            nombre: req.session.usuario.nombre,
            correo: req.session.usuario.correo,
        });
    });
});

app.post('/inscripcioncurso', (req,res) =>{

    let aspiranteCurso = new AspiranteCurso({
        nroDocumento:   req.session.usuario.nroDocumento,
        nombre:         req.session.usuario.nombre,
        correo:         req.session.usuario.correo,
        telefono:       req.body.telefonoaspirante,
        idApirante:     req.session.usuario._id,
        idCurso:        req.body.curso
    })
    
    aspiranteCurso.save((err, respuesta) => {       

        if(err)
        {
            Curso.find({estado: 'disponible'}).exec((err, resp) => {
                if(err)
                    return console.log(err);
        
                res.render('inscripcion-curso', {
                    respuesta: false,
                    listado: resp,
                    nroDocumento: req.session.usuario.nroDocumento,
                    nombre: req.session.usuario.nombre,
                    correo: req.session.usuario.correo,
                })
            })
        }

        Curso.find({estado: 'disponible'}).exec((err, resp) => {
            if(err)
                return console.log(err);
    
            res.render('inscripcion-curso', {
                respuesta: true,
                listado: resp,
                nroDocumento: req.session.usuario.nroDocumento,
                nombre: req.session.usuario.nombre,
                correo: req.session.usuario.correo,
            })
        })
    })
});













app.get('/registrarnotas', (req, res) => {

    console.log(req.session);
    console.log(req.session.usuario);

    res.render('registrar-notas-est', {
        mostrar: '',
    });
});

app.post('/registrarnotas', (req,res) =>{
    let estudiante = new Estudiante({
        nombre: req.body.nombre,
        contrasena: bcrypt.hashSync(req.body.contrasena, 10),
        matematicas: req.body.nota1,
        ingles: req.body.nota2,
        programacion: req.body.nota3
    })

    estudiante.save((err, result) =>{
        if(err)
        {
            res.render('registrar-notas-est', {
                mostrar: err,
            })
        }

        res.render('registrar-notas-est', {
            mostrar: result,
        })
    })
});



app.get('/editarnotas', (req, res) => {

    // busqueda con variable de sesión
    //Estudiante.findById(req.session.usuario,  (err, estudiante) => {
    
    // busqueda con token
    console.log(req.usuario);
    Estudiante.findById(req.usuario,  (err, estudiante) => {
    
        if(err)
            return console.log(err);

        if(!estudiante)
        {
            console.log('No se encontro estudiante');
            return res.redirect('/');
        }

        res.render('editar-notas-est', {
            nombre: estudiante.nombre,
            matematicas: estudiante.matematicas,
            ingles: estudiante.ingles,
            programacion: estudiante.programacion
        });
    });
});

app.post('/editarnotas', (req,res) =>{

    Estudiante.findOneAndUpdate({nombre: req.body.nombre}, req.body, {new: true, runValidators: true, context: 'query' } ,(err, result) =>{
        if(err)
        {
            res.render('editar-notas-est', {
                mostrar: err
            })
        }
        else if(result == null)
        {
            console.log('resultado');
            console.log(result);

            res.render('editar-notas-est', {
                mostrar: 'No se encontro el estudiante'
            })
        }
        else 
        {
            res.render('editar-notas-est', {
                mostrar: 'Notas del estudiante actualizadas exitosamente',
                nombre: result.nombre,
                matematicas: result.matematicas,
                ingles: result.ingles,
                programacion: result.programacion
            })
        }
    })
});

app.post('/eliminarnotas', (req,res) =>{

    Estudiante.findOneAndDelete({nombre: req.body.nombre}, req.body, (err, result) =>{
        if(err)
        {
            res.render('listar-notas-est', {
                mostrar: err
            })
        }
        else if(!result)
        {
            res.render('listar-notas-est', {
                mostrar: 'No se encontro el estudiante'
            })
        }
        else 
        {
            console.log(result);

            Estudiante.find({}).exec((err, resp) => {
                if(err)
                    return console.log(err);
        
                res.render('listar-notas-est', {
                    mostrar: 'Operación exitosa, se elimino '+result.nombre,
                    listado: resp,
                });
            });
        }
    })
});
 
app.get('*', (req,res) =>{
    res.render('error');
});

module.exports = app