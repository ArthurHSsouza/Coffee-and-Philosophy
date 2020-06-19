const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
require('../models/usuario')
const usuario = mongoose.model('usuarios')

router.get('/formCadastro',(req,res)=>{
   res.render("user/formCadastro")
})

router.post('/novoUsuario',(req,res)=>{
   var err = []

   if(req.body.nome == ""  || typeof req.body.nome == undefined || req.body.nome == null){
       err.push({text: "Nome inválido"})
   }
   if(req.body.email == "" || typeof req.body.email == undefined || req.body.email == null){
       err.push({text: "E-mail inválido"})
   }
   if(req.body.senha == "" || typeof req.body.senha == undefined || req.body.senha == null){
       err.push({text: "Senha inválida"})
   }
   if(req.body.senha != req.body.senha2){
       err.push({text: "As senhas devem ser iguais"})

   }
   if(req.body.senha.length < 8){
     err.push({text: "A senha deve ter no mínimo 8 caracteres"})
   }

   if(err.length > 0){
       res.render('user/formCadastro',{err: err})
   }else{
       usuario.findOne({email: req.body.email}).then((usuarioEncontrado)=>{
          if(usuarioEncontrado){
              req.flash("error_msg","O endereço de e-mail já foi registrado")
              res.redirect('/user/formCadastro')
          }else{
               var novoUsuario={
                   nome: req.body.nome,
                   email: req.body.email,
                   senha: req.body.senha
               }
               bcrypt.genSalt(10,(err,salt)=>{
                   if(err){
                      console.log("Erro ao gerar o salt: "+err)
                      req.flash("error_msg","Erro ao realizar verificação")
                      res.render("/user/novoUsuario")
                   }else{
                       bcrypt.hash(novoUsuario.senha, salt, (err, hash)=>{
                           if(err){
                               console.log("Erro ao gerar o hash: "+err)
                               req.flash("error_msg","Erro ao realizar verificação")
                               res.render("/user/novoUsuario")
                           }else{
                               novoUsuario.senha = hash
                               new usuario(novoUsuario).save().then(()=>{
                                   passport.authenticate('local', (req,res) =>{
                                    req.flash("success_msg","Bem vindo "+req.user.nome+"!")
                                    res.redirect('/')
                                   })
                                   req.flash("success_msg","Usuário criado com sucesso")
                                   res.redirect('/')
                               }).catch((err)=>{
                                   console.log("Erro ao salvar usuário no banco de dados: "+err)
                                   req.flash("error_msg","Erro ao salvar usuário")
                                   res.redirect('/')
                               })
                           }
                       })
                   }
               })
          }
       })
   }

})

router.get('/formLogin',(req,res)=>{
    res.render('user/formLogin')
})


router.post('/auth',passport.authenticate('local',{
    failureRedirect: '/user/formLogin',
    failureFlash: true
    
    
}),(req,res)=>{

    req.flash("success_msg","Bem vindo "+req.user.nome+"!")
    res.redirect('/')
})

router.get('/logout',(req,res)=>{
    req.logout()
    res.redirect('/')
})



module.exports = router