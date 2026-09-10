exports.show404=(req,res,next)=>{
    console.log({pageTitle:'page not found', currentPage:'404',isLoggedIn:req.isLoggedIn});
    res.status(404).render('404',{pageTitle:'page not found', currentPage:'404',isLoggedIn:req.isLoggedIn,
        user:req.session.user
    });
}
