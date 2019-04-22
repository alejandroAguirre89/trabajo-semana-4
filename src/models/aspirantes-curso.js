const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

const aspiranteCursoSchema = new Schema({
    nroDocumento:{
        type: String,
        required: true
    },
    nombre:{
        type: String,
        trim: true,
        required: true
    },
    correo:{
        type: String,
        required: true
    },
    telefono:{
        type: Number,
        required: true
    },    
    idAspirante:{
        type: String,
        required: true,
        trim: true
    },
    idCurso:{
        type: String,
        required: true,
        trim: true
    }
 });

aspiranteCursoSchema.plugin(uniqueValidator);
const AspiranteCurso = mongoose.model('aspirante-curso', aspiranteCursoSchema);

module.exports = AspiranteCurso
 