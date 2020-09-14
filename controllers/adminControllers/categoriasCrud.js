const mongoose = require("mongoose")
require("../../models/categoria")
require("../../models/postagem")
const categoria = mongoose.model('categorias')
const postagem = mongoose.model('postagens')
const slug = require('slug')

module.exports = class categoriasCrud{
     
    getCategorias(req,res){
        categoria.find().lean().then((categorias)=>{
             res.render('adm/categorias',{categoria: categorias, quantidade: categorias.length})
        }).catch((err)=>{
            console.log("Erro ao exibir categorias: "+err)
            req.flash("error_msg","Erro ao exibir categorias, tente novamente")
            res.redirect("/admin/categorias")
        })
    }
    addCategorias(req,res){
        res.render('adm/addCategorias')
   }

    newCategoria(req,res){
       
            var err = []
      
            if(req.body.nome == "" || typeof req.body.nome == undefined || req.body.nome == null){
                err.push({text: "Nome inválido"})
            }
            if(req.body.slug =="" || typeof req.body.slug == undefined || req.body.slug == null){
                err.push({text: "Slug Inválido"})
            }
      
             if(err.length > 0){
                 res.render('adm/addCategoria',{err: err})
             }else{
      
                  var novaCategoria = {
                      nome: req.body.nome,
                      slug: req.body.slug
                  }
                  novaCategoria.slug = slug(novaCategoria.slug)
                  new categoria(novaCategoria).save().then(()=>{
                      console.log("Categoria criada com sucesso")
                      res.redirect("/admin/categorias")
                  }).catch((err)=>{
                      console.log("erro ao criar categoria: "+err)
                      req.redirect("/admin/categorias")
                  })
               }
            
            }
            
    editCategoriaForm(req,res){
            categoria.findOne({_id: req.params.id}).lean().then((categoria)=>{
            res.render("adm/editarCategoria",{categoria: categoria})
        })
              
    }

    editCategoria(req,res){
           
            var err = []
            if(req.body.nome == "" || typeof req.body.nome == undefined || req.body.nome == null){
                err.push({text: "Nome inválido"})
            }
            if(req.body.slug == "" || typeof req.body.slug == undefined || req.body.slug == null){
                err.push({text: "Slug inválido"})
            }
   
            if(err.length > 0){
                res.render("adm/editarCategoria",{err:err})
            }else{
                var where ={_id: req.body.id}
                var values= {nome: req.body.nome, slug: req.body.slug}
                values.slug = slug(values.slug)
   
                categoria.findOneAndUpdate(where,values).then(()=>{
                    req.flash("success_msg","Categoria modificada com sucesso")
                    res.redirect('/admin/categorias')
                }).catch((err)=>{
                        console.log("Erro ao editar categoria: "+err)
                        req.flash("error_msg","Não foi possível editar categoria")
                        res.redirect("/")
                })
            }
    }

    deleteCategoria(req,res){   
        postagem.deleteOne({_id: req.params.id}).then(()=>{
            req.flash("success_msg","Postagem deletada com sucesso")
            res.redirect('/admin/postagens')
        }).catch((err)=>{
            console.log("Erro ao deletar postagem: "+err)
            req.flash("error_msg","Erro ao deletar postagem")
       res.redirect("/admin/postagens")
        })
    } 
 
}