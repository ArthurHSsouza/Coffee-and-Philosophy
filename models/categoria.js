const mongoose = require('mongoose')

const schema = mongoose.Schema

const categoria = new schema({
    nome:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true
    }
})

mongoose.model('categorias',categoria,)