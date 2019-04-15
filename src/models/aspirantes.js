const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

const aspiranteSchema = new Schema({
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
    contrasena:{
        type: String,
        required: true
    },
    rol:{
        type: String,
        required: true,
        enum: ['coordinador', 'aspirante']
    }
 });

aspiranteSchema.plugin(uniqueValidator);
const Aspirante = mongoose.model('aspirante', aspiranteSchema);

module.exports = Aspirante
 