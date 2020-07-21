//Arquivo principal
//Importando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const mongoose = require("mongoose")
const admin = require('./routes/admin')
const user = require('./routes/user')
const bodyParser = require("body-parser")
const session = require('express-session')
const util = require('util')
const flash = require("connect-flash")
const passport = require('passport')
require('./models/postagem')
require('./models/categoria')
require('./config/auth')(passport)
const postagem = mongoose.model("postagens")
const categoria = mongoose.model("categorias")
const path = require("path")
//configurando módulos
//express
const app = express()

//mongoose
mongoose.promise = global.Promise
mongoose.connect('mongodb+srv://artoriaskillerxdie:18901347a@cluster0-a9kmc.azure.mongodb.net/blogAppJairo',
{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
       console.log("Conectado com sucesso ao mongodb")
}).catch((err)=>{
    console.log("Erro ao se conectar ao mongodb: "+err)
})

//handlebars

   app.engine('handlebars',handlebars({defaultLayout: 'main'}))
   app.set('view engine', 'handlebars')

//body-Parser

  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())

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

app.get("/",(req,res)=>{
    postagem.find().lean().populate('categoria').then((categorias)=>{
        res.render('inicio',{categorias: categorias}) 
    })
    
})

app.get('/exibirPost/:slug',(req,res)=>{
    postagem.findOne({slug: req.params.slug}).lean().populate('categoria').then((postagem)=>{
        res.render('exibirPostagem',{postagem: postagem})
    })
})

app.get('/listarCategorias',(req,res)=>{
   
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
        
    })

        
app.get("/listarPosts/:id",(req,res)=>{
    postagem.find({categoria: req.params.id}).lean().then((postagens)=>{
        categoria.findOne({_id: req.params.id}).lean().then((categoria)=>{
           res.render("listarPosts",{postagens: postagens, categoria: categoria.nome})  
        })
    })
})

app.get('/quemSomos',(req,res)=>{
      res.render('quemSomos')
})

app.get('/contato',(req,res)=>{
    res.render('contato')
})

// Conexão
const PORT = process.env.PORT || 8080
app.listen(PORT,(err)=>{
    if(err){
        console.log("Erro ao se conectar na porta: "+err)
    }else{
        console.log("Conectado com sucesso na porta: ",PORT)
    }
})