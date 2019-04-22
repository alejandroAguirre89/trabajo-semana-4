const Curso      = require('../models/cursos')
const Aspirante  = require('./../models/aspirantes')
const AspiranteCurso  = require('./../models/aspirantes-curso')

/* Busca un aspirante por un correo electronico
dado.*/
const buscarApirantePorEmail = (correo, callback) => {

    Aspirante.findOne({correo: correo}, (err, result) =>{

        if(err)
            callback(console.log(err))

        if(result == null)
            callback('')

        if(result)
            callback(result)
    })
}

module.exports = {
    buscarApirantePorEmail
}