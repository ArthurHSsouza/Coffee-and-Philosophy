//chamada de módulos
const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
require("../models/categoria")
require("../models/postagem")
const categoria = mongoose.model('categorias')
const postagem = mongoose.model('postagens')
const slug = require('slug')
require("../config/adminSecure")(router)

//Rotas de adm
//Página principal
router.get('/',(req,res)=>{
      res.render('adm/adm')
 })

// CRUD de categorias

router.get('/categorias',(req,res)=>{
    
    categoria.find().lean().then((categorias)=>{
         res.render('adm/categorias',{categoria: categorias, quantidade: categorias.length})
    }).catch((err)=>{
        console.log("Erro ao exibir categorias: "+err)
        req.flash("error_msg","Erro ao exibir categorias, tente novamente")
        res.redirect("/admin/categorias")
    })
   
})

router.get('/addCategoria',(req,res)=>{
       res.render('adm/addCategorias')
})

router.post('/novaCategoria',(req,res)=>{
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
      })
      router.get('/deletarCategoria/:id',(req,res)=>{
         categoria.deleteOne({_id: req.params.id}).then(()=>{
             req.flash("success_msg","categoria deletada com sucesso")
             res.redirect('/admin/categorias')
         })
      })

      router.get('/editarCategoria/:id',(req,res)=>{
            categoria.findOne({_id: req.params.id}).lean().then((categoria)=>{
                  res.render("adm/editarCategoria",{categoria: categoria})
            })
      })

    router.post('/editarCategoria',(req,res)=>{
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
    })

      // CRUD de postagens

     router.get('/postagens',(req,res)=>{
         postagem.find().lean().populate('categoria').then((postagens)=>{
             res.render('adm/postagens',{postagens: postagens,quantidade: postagens.length})
         }).catch((err)=>{
              console.log("Erro ao exibir postagens: "+err)
              req.flash("error_msg","Erro ao exibir postagens, tente novamente")
              res.redirect('/admin/postagens')
         })
     })
     
     router.get("/addPostagens",(req,res)=>{
        categoria.find().lean().then((categoria)=>{
             res.render("adm/addPostagens",{categoria:categoria})
        }).catch((err)=>{
            console.log("Erro ao encontrar categorias: "+err)
            req.flash("error_msg","Erro ao renderizar página")
            res.redirect('/admin')
        })  
    })

        router.post("/novaPostagem",(req,res)=>{

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
        })
       
      router.get('/deletarPostagem/:id',(req,res)=>{
         postagem.deleteOne({_id: req.params.id}).then(()=>{
             req.flash("success_msg","Postagem deletada com sucesso")
             res.redirect('/admin/postagens')
         }).catch((err)=>{
            console.log("Erro ao deletar postagem: "+err)
            req.flash("error_msg","Erro ao deletar postagem")
            res.redirect("/admin/postagens")
         })
      })

      router.get('/editarPostagem/:id',(req,res)=>{
           postagem.findOne({_id: req.params.id}).lean().then((postagem)=>{
               console.log(postagem)
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
      })

      router.post('/editarPostagem',(req,res)=>{
          
           console.log(`${req.body.titulo}\n${req.body.id}
           \n${req.body.descricao}\n${req.body.slug}\n
           ${req.body.conteudo}\n${req.body.categoria}`)

           
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
                  res.render("adm/editarPostagem",{err: err,categoria:categoria}) 
               }).catch((err)=>{
                   console.log("Erro ao recuperar categorias: "+err)
                   req.flash("error_msg","A página de cadastro de categorias não está disponível")
                   res.redirect("/admin")
               })  
            }
            
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
          

          /*
           var where = _id = req.body.id
           var values = {
               titulo: req.body.titulo,
               descricao: req.body.descricao,
               slug: req.body.slug,
               conteudo: req.body.conteudo,
               categoria: req.body.categoria,
               date: Date.now()
           }
         values.slug = slug(values.slug)
           
           
           postagem.findOneAndUpdate(where,values,{useFindAndModify: false}).then(()=>{
               req.flash("success_msg","Postagem editada com sucesso")
               res.redirect('/admin/postagens')
           }).catch((err)=>{
               console.log("Erro ao editar postagem: "+err)
               req.flash("error_msg","Erro ao editar postagem")
               res.redirect('/admin/postagens')
           })*/
      })

 module.exports = router