const Curso      = require('../models/cursos')
const Aspirante  = require('./../models/aspirantes')
const AspiranteCurso  = require('./../models/aspirantes-curso')

/* Busca un aspirante por un correo electronico
dado.*/
const buscarAspirantePorEmail = (correo, callback) => {

    Aspirante.findOne({correo: correo}, (err, result) =>{

        if(err)
            callback(console.log(err))

        if(result == null)
            callback('')

        if(result)
            callback(result)
    })
}

const obtenerApirantesPorCurso = (callback) => {

    Curso.find({estado: 'disponible'}).exec((err, listadoCursos) => {
        if(err)
            return console.log(err);

        let arrayResp = []
        let i = 0

        listadoCursos.forEach(function(curso) {

            AspiranteCurso.find({idCurso: curso._id}).exec((err, listadoAspirantesCursos) => {

                let arrayIdAspirantesCurso = []

                listadoAspirantesCursos.forEach(function(aspiranteCurso) {
                    arrayIdAspirantesCurso.push(aspiranteCurso.idAspirante);
                })

                Aspirante.find({_id: arrayIdAspirantesCurso}).exec((err, listadoAspirantes) => {

                    arrayResp.push({
                        _id: curso._id,
                        nombre: curso.nombre,
                        aspirantes: listadoAspirantes
                    });

                    if(listadoCursos.length-1 == i)
                    {
                        callback(arrayResp)
                    }

                    i = i + 1
                })
            })
        })
    })
}

module.exports = {
    buscarAspirantePorEmail,
    obtenerApirantesPorCurso
}