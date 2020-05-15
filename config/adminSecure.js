module.exports = (router)=>{
    router.use((req,res,next)=>{
        if(req.user && req.user.admin == false){
           req.flash("error_msg","Você não tem permissão para acessar essa área")
           res.redirect('/')

        }else if(req.user){
            next()
        }
        else{
           res.redirect('/user/formLogin')
        }
    })
}