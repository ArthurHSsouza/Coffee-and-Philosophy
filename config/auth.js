const mongoose = require('mongoose')
const localStrategy = require('passport-local').Strategy
const bcrypt = require("bcryptjs")
require('../models/usuario')
const usuario = mongoose.model('usuarios')

 module.exports = (passport)=>{
      passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'},
      (email,senha,done)=>{
        usuario.findOne({email: email}).then((user)=>{
          if(!user){
           return done(null,false,{message: "Usuário não encontrado"})
          }else{
            bcrypt.compare(senha, user.senha, (err, iguais)=>{
               if(err){
                   return done(err)
               }else{
                 if(iguais){
                    return done(null,user)
                 }else{
                   return done(null, false, {message: "Senha incorreta"})
                 }
               }
            })
          }
        }).catch((err)=>{
          return done(err)
        })
    }))

     passport.serializeUser((usuario, done)=>{
        done(null, usuario.id)
     })

     passport.deserializeUser((id, done)=>{
       usuario.findById(id, (err, usuario)=>{
         done(err, usuario)
       })
     })
 }
 
 


