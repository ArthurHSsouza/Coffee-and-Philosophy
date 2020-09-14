//Arquivo principal
//Importando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const mongoose = require("mongoose")

const session = require('express-session')
const flash = require("connect-flash")
const passport = require('passport')
const path = require("path")

//routes
const admin = require('./routes/admin')
const user = require('./routes/user')
const index = require('./routes/index')

require('./models/postagem')
require('./models/categoria')
require('./config/auth')(passport)


//configurando módulos
//express
const app = express()

//mongoose
mongoose.promise = global.Promise
mongoose.connect('credenciais do mongodb devem vir aqui',
{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
       console.log("Conectado com sucesso ao mongodb")
}).catch((err)=>{
    console.log("Erro ao se conectar ao mongodb: "+err)
})

//handlebars
   app.engine('handlebars',handlebars({defaultLayout: 'main'}))
   app.set('view engine', 'handlebars')

//body-Parser
  app.use(express.urlencoded({extended: false}))
  app.use(express.json())

//express-session
app.use(session({
    secret: 'bolinho de milho',
    resave: false,
    saveUninitialized: false
}))

//passport
app.use(passport.initialize())
app.use(passport.session())

//connect-flash
app.use(flash())

//middleware para variaveis globais
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user
    next()
})

//static files
app.use('/static',express.static(path.join(__dirname+"/public")))
//

//Rotas
app.use('/admin',admin)
app.use('/user', user)
app.use(index)

// Conexão
const PORT = process.env.PORT || 3000
app.listen(PORT,(err)=>{
    if(err){
        console.log("Erro ao se conectar na porta: "+err)
    }else{
        console.log("Conectado com sucesso na porta: ",PORT)
    }
})
