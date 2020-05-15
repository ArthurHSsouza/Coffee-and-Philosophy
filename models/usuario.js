const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const usuario = new Schema({
    nome:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    senha:{
        type: String,
        required: true
    },
    admin:{
         type: Boolean,
         default: false
    }
    
})

mongoose.model('usuarios',usuario)