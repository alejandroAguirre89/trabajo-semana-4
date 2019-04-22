const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

const aspiranteSchema = new Schema({
    nroDocumento:{
        type: String,
        unique: [true, 'Este número de documento ya se encuentra registrado'],
        required: [true, 'El número de documento es requerido']
    },
    nombre:{
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    correo:{
        type: String,
        unique: [true, 'Este correo electronico ya se encuentra registrado'],
        required: [true, 'El correo electronico es requerido'],
    },
    contrasena:{
        type: String,
        required: [true, 'La contraseña es requerida'],
    },
    avatar: {
        type: Buffer
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
 