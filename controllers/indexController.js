const mongoose = require("mongoose")
require("../models/categoria")
require("../models/postagem")
const categoria = mongoose.model('categorias')
const postagem = mongoose.model('postagens')

module.exports = class indexController{
    
    index(req,res){
        postagem.find().lean().populate('categoria').then((categorias)=>{
            res.render('inicio',{categorias: categorias}) 
        })    
     }

    exibirPost(req,res){
        postagem.findOne({slug: req.params.slug}).lean().populate('categoria').then((postagem)=>{
             res.render('exibirPostagem',{postagem: postagem})
        })
    }

    listarCategorias(req,res){

        var cat = [] 
        async function main(){
            var postagens
            var categorias = await categoria.find().lean()
            for(var i=0; i<categorias.length;i++){
                postagens = await postagem.find({categoria: categorias[i]._id}).lean()
                cat.push({categoria: categorias[i], quantidade: postagens.length}) 
            }
            res.render('listarCategorias',{result: cat})         
        }
        main()
    }

    listarPosts(req,res){
        postagem.find({categoria: req.params.id}).lean().then((postagens)=>{
            categoria.findOne({_id: req.params.id}).lean().then((categoria)=>{
            res.render("listarPosts",{postagens: postagens, categoria: categoria.nome})  
         })
        })
    }

    quemSomos(req,res){
        res.render('quemSomos')
    }

    contato(req,res){
        res.render('contato')
    }
}

