//chamada de módulos
const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
require("../config/adminSecure")(router)
const controller = new adminController()

//Rotas de adm
//Página principal
router.get('/',controller.main)

// CRUD de categorias
router.get('/categorias',controller.categorias.getCategorias)
router.get('/addCategoria',controller.categorias.addCategorias)
router.post('/novaCategoria',controller.categorias.newCategoria)
router.get('/editarCategoria/:id',controller.categorias.editCategoriaForm)
router.post('/editarCategoria',controller.categorias.editCategoria)
router.get('/deletarCategoria/:id',controller.categorias.deleteCategoria)

// CRUD de postagens
router.get('/postagens', controller.postagens.postagens)
router.get('/addPostagens', controller.postagens.addPostagens)
router.post("/novaPostagem", controller.postagens.novaPostagem)
router.get('/deletarPostagem/:id', controller.postagens.deletarPostagem)
router.get('/editarPostagem/:id', controller.postagens.editarPostagemForm)
router.post('/editarPostagem', controller.postagens.editarPostagem)

 module.exports = router