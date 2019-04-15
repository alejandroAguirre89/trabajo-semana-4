const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

const cursosSchema = new Schema({
    nombre:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    modalidad: {
        type: String,
        required: true
    },
    valor: {
        type: Number,
        min: 0,
    },
    descripcion: {
        type: String
    },
    intensidadHoraria: {
        type: Number,
        min: 0
    },
    estado:{
        type: String,
        required: true,
        enum: ['disponible', 'cerrado']
    }
 });

 cursosSchema.plugin(uniqueValidator);
 const Curso = mongoose.model('curso', cursosSchema);

 module.exports = Curso
 