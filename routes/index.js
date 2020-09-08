const express = require('express')
const router = express.Router()

const indexController = require('../controllers/indexController')
const controller = new indexController()

router.get("/",controller.index)
router.get('/exibirPost/:slug',controller.exibirPost)
router.get('/listarCategorias',controller.listarCategorias)  
router.get("/listarPosts/:id",controller.listarPosts)
router.get('/quemSomos',controller.quemSomos)
router.get('/contato',controller.contato)

module.exports = router;