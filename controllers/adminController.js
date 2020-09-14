const mongoose = require("mongoose")
require("../models/categoria")
require("../models/postagem")
const categoria = mongoose.model('categorias')
const postagem = mongoose.model('postagens')
const slug = require('slug')


const categoriasCrud = require("./adminControllers/categoriasCrud")
const postagensCrud  = require("./adminControllers/postagensCrud")

module.exports = class adminController{
      
    constructor(){
        this._categorias = new categoriasCrud()
        this._postagens  = new  postagensCrud()
    }

    //entrada
    main(req,res){
        res.render('adm/adm')
    }
    
    //Definindo abstração de propriedades
    get categorias(){
        return this._categorias
    }
    get postagens(){
        return this._postagens
    }
}