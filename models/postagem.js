const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postagem = new Schema({
   titulo:{
        type: String,
        required: true
   },
    descricao:{
        type: String,
        required: true
    },
    conteudo:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    },
    slug:{
       type: String,
       required: true  
    },
     categoria:{
        type: Schema.Types.ObjectId,
         ref: 'categorias'
     }
})

mongoose.model('postagens',postagem)