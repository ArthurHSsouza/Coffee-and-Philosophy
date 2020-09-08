const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController');
const controller = new userController();

router.get('/formCadastro',controller.formCadastro)
router.post('/novoUsuario',controller.novoUsuario)
router.get('/formLogin',controller.formLogin)
router.post('/auth',passport.authenticate('local',{
    failureRedirect: '/user/formLogin',
    failureFlash: true
    
    
}),controller.auth)
router.get('/logout',controller.logout)

module.exports = router