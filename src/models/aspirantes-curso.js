const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

const aspiranteCursoSchema = new Schema({
    nroDocumento:{
        type: String,
        unique: true,
        required: true
    },
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    correo:{
        type: String,
        unique: true,
        required: true
    },
    telefono:{
        type: Number,
        unique: true,
        required: true
    },    
    idApirante:{
        type: String,
        required: true
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
 