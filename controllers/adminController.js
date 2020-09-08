const mongoose = require("mongoose")
require("../models/categoria")
require("../models/postagem")
const categoria = mongoose.model('categorias')
const postagem = mongoose.model('postagens')
const slug = require('slug')
require("../config/adminSecure")(router)

const categoriasCrud = require("./adminControllers/categoriasCrud")
const postagensCrud  = require("./adminControllers/postagensCrud")

module.exports = class adminController{
      
    constructor(){
        this._categorias = new categoriasCrud()
        this._postagens  = new  postagensCrud()
    }
    
    //Definindo abstração de propriedades
    get categorias(){
        return this._categorias
    }
    get postagens(){
        return this._postagens
    }
}