const mongoose = require("mongoose")
require("../../models/categoria")
require("../../models/postagem")
const categoria = mongoose.model('categorias')
const postagem = mongoose.model('postagens')
const slug = require('slug')
require("../../config/adminSecure")(router)

class postagensCrud{

    postagens(req,res){
        postagem.find().lean().populate('categoria').then((postagens)=>{
            res.render('adm/postagens',{postagens: postagens,quantidade: postagens.length})
        }).catch((err)=>{
             console.log("Erro ao exibir postagens: "+err)
             req.flash("error_msg","Erro ao exibir postagens, tente novamente")
             res.redirect('/admin/postagens')
        })
      }
    
    addPostagens(req,res){
            categoria.find().lean().then((categoria)=>{
                 res.render("adm/addPostagens",{categoria:categoria})
            }).catch((err)=>{
                console.log("Erro ao encontrar categorias: "+err)
                req.flash("error_msg","Erro ao renderizar página")
                res.redirect('/admin')
            })  
    }
    
    novaPostagem(req,res){
    
            var err = []
            if(req.body.titulo == "" || typeof req.body.titulo == undefined || req.body.titulo == null){
                err.push({text: "Titulo inválido"})
            }
            if(req.body.descricao == "" || typeof req.body.descricao == undefined || req.body.descricao == null){
                err.push({text: "Descrição inválida"})
            }
            if(req.body.conteudo == "" || typeof req.body.conteudo == undefined || req.body.conteudo == null){
                err.push({text: "Preencha o conteúdo"})
            }
            if(typeof req.body.categoria == undefined || req.body.categoria == null){
                err.push({text: "Categoria inválida"})
            }
            if(req.body.slug == "" || typeof req.body.slug == undefined || req.body.slug == null){
                err.push({text: "Slug inválido"})
            }
 
            if(err.length > 0){
                categoria.find().lean().then((categoria)=>{
                   res.render("adm/addPostagens",{err: err,categoria:categoria}) 
                }).catch((err)=>{
                    console.log("Erro ao recuperar categorias: "+err)
                    req.flash("error_msg","A página de cadastro de categorias não está disponível")
                    res.redirect("/admin")
                })  
            }else{
                   postagem.findOne({titulo: req.body.titulo}).then((post)=>{
                   if(post){
                       req.flash("error_msg","Este título já foi usado em outra postagem")
                       res.redirect('/admin/addPostagens')
                   }else{
                                
                        novaPostagem = {
                           titulo: req.body.titulo,
                           descricao: req.body.descricao,
                           conteudo: req.body.conteudo,
                           categoria: req.body.categoria,
                           slug: req.body.slug
                          }
                          console.log(req.body.conteudo)
                           novaPostagem.slug = slug(novaPostagem.slug)
                           new postagem(novaPostagem).save().then(()=>{
                               req.flash("success_msg","Postagem cadastrada com sucesso")
                               res.redirect("/admin/postagens")
                           }).catch((err)=>{
                               console.log("Erro ao salvar postagem: "+err)
                               req.flash("error_msg","Erro ao salvar categoria")
                               res.redirect('/admin/postagens')
                           })
                   }
             }).catch((err)=>{
                 console.log("Erro ao verificar titulo: "+err)
                 req.flash("error_msg","Erro ao salvar categoria")
                 res.redirect('/admin/addPostagens')
             })
            }
        }

    deletarPostagem(req,res){
        
            postagem.deleteOne({_id: req.params.id}).then(()=>{
                req.flash("success_msg","Postagem deletada com sucesso")
                res.redirect('/admin/postagens')
            }).catch((err)=>{
               console.log("Erro ao deletar postagem: "+err)
               req.flash("error_msg","Erro ao deletar postagem")
               res.redirect("/admin/postagens")
            })
        }
      
    editarPostagemForm(req,res){
            postagem.findOne({_id: req.params.id}).lean().then((postagem)=>{
                //console.log(postagem)
                categoria.find().lean().then((categorias)=>{
                    res.render("adm/editarPostagem",{postagem: postagem,categorias: categorias}) 
                }).catch((err)=>{
                    console.log("Erro ao renderizar categorias: "+err)
                    req.flash("error_msg","Erro ao abrir página")
                    res.redirect('/admin/postagens')
                }).catch((err)=>{
                   console.log("Erro ao renderizar a postagem: "+err)
                   req.flash("error_msg","Erro ao abrir página")
                   res.redirect('/admin/postagens')
                })
            })
    }  
    
    editarPostagem(req,res){
          
            var err = []
            if(req.body.titulo == "" || typeof req.body.titulo == undefined || req.body.titulo == null){
                err.push({text: "Titulo inválido"})
            }
            if(req.body.descricao == "" || typeof req.body.descricao == undefined || req.body.descricao == null){
                err.push({text: "Descrição inválida"})
            }
            if(req.body.conteudo == "" || typeof req.body.conteudo == undefined || req.body.conteudo == null){
                err.push({text: "Preencha o conteúdo"})
            }
            if(typeof req.body.categoria == undefined || req.body.categoria == null){
                err.push({text: "Categoria inválida"})
            }
            if(req.body.slug == "" || typeof req.body.slug == undefined || req.body.slug == null){
                err.push({text: "Slug inválido"})
            }
  
  
            if(err.length > 0){
                postagem.findOne({_id: req.body.id}).lean().then((postagem)=>{
                  categoria.find().lean().then((categoria)=>{
                   res.render("adm/editarPostagem",{err: err, categorias: categoria, postagem: postagem}) 
                    }).catch((err)=>{
                    console.log("Erro ao recuperar categorias: "+err)
                    req.flash("error_msg","A página de edição desta postagem não está disponível tente novamente mais tarde")
                    res.redirect("/admin")
                })  
                }).catch((err)=>{
                    console.log("Erro ao recuperar postagem: "+err)
                    req.flash('error-msg',"A Página de edição desta postagem não está disponível, tente novamente mais tarde")
                    res.redirect('/admin')
                })
               
             }else{
            postagem.findOne({_id: req.body.id}).then((Postagem)=>{
                Postagem.titulo = req.body.titulo
                Postagem.descricao =req.body.descricao
                Postagem.slug = req.body.slug
                Postagem.conteudo = req.body.conteudo
                Postagem.categoria = req.body.categoria
  
                Postagem.save().then(()=>{
                 req.flash("success_msg","Postagem editada com sucesso")
                 res.redirect('/admin/postagens')
                }).catch((err)=>{
                 console.log("Erro ao editar postagem: "+err)
                 req.flash("error_msg","Erro ao editar postagem")
                 res.redirect('/admin/postagens')
             })
            })
         }
    }

}

module.exports = postagensCrud;