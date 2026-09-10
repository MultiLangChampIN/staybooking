const Home=require("../models/homes");
const fs=require('fs');
exports.getAddHome=(req,res,next)=>{
    
    // res.sendFile(path.join(__dirname,'../','/views','addhome.html'));
    console.log({pageTitle:'register home page', currentPage:'add-home'});
    res.render('host/edit-home',
        {pageTitle:'register home page',
         currentPage:'edit-home',
         editing:false,
         isLoggedIn:req.isLoggedIn,
         user:req.session.user
        });
}
exports.getEditHome=(req,res,next)=>{
    const homeId=req.params.homeId;
    const editing=req.query.editing==='true';
    
    Home.findById(homeId).then(homes=>{
        const home=homes
        if(!home){
            console.log("home not found for edit ");
            return res.redirect("/host/host-home-list")
        }
        console.log(homeId,editing,home);
        console.log({pageTitle:'edit home details', currentPage:'edit-home'})
        res.render('host/edit-home',{
            home:home,
            pageTitle:'edit home details', currentPage:'host-home-list',
            editing:editing,
            isLoggedIn:req.isLoggedIn,
            user:req.session.user
        });

    });
    
};

exports.getHostHomesList = (req, res, next) => {
   Home.find().then(registeredHomes => {

        console.log( {pageTitle: 'host home list', currentPage: 'host-home-list' });
        res.render('host/host-home-list', { registeredHomes: registeredHomes, pageTitle: 'host home list', currentPage: 'host-home-list',isLoggedIn:req.isLoggedIn,user:req.session.user })

    });
}

exports.postAddHome=(req,res,next)=>{
    console.log('home registeration successfull for :',req.body,req.body.houseName);
    const {houseName,location,pricePerNight,rating,description}=req.body
    const photoUrl=req.file.path;
    console.log(houseName,location,pricePerNight,rating,photoUrl,description);
    const home=new Home({houseName,location,pricePerNight,rating,photoUrl,description})
    console.log(req.file);
    home.save().then(()=>{
        console.log("home saved successfull");
    });

    // res.sendFile(path.join(__dirname,'../','/views','homeRegistered.html'));
    console.log({pageTitle:'Home Registered successfull',currentPage:'homeRegistered'});
    res.redirect('/host/host-home-list');
}
exports.postEditHome=(req,res,next)=>{
    console.log('home updation successfull for :',req.body,req.body.houseName);

    const {id,houseName,location,pricePerNight,rating,description}=req.body
    console.log(id);
    
    Home.findById(id).then((home)=>{
        home.houseName=houseName;
        home.location=location;
        home.pricePerNight=pricePerNight;
        home.rating=rating;
        
        home.description=description;

        
        if(req.file){
            fs.unlink(home.photoUrl,(err)=>{
                if(err){
                    console.log("error while deleting old file ",err);
                }
            })
            home.photoUrl=req.file.path
        }
        home.save().then(result=>{
            console.log('home updated',result);
        }).catch(err=>{
            console.log('error while updating',err);
        })

            res.redirect('/host/host-home-list');
    }).catch(err=>{
            console.log('error while finding home ',err);
    })
    
    console.log({pageTitle:'updation  successfull',currentPage:'updated'});

}

exports.postDeleteHome=(req,res,next)=>{

    const homeId=req.params.homeId;
    console.log('came at delete',homeId);

    Home.findByIdAndDelete(homeId).then(()=>{
        console.log('deletion successfull');
        res.redirect('/host/host-home-list');

}).catch(error=>{
    console.log("error occured",error);
})

    // res.sendFile(path.join(__dirname,'../','/views','homeRegistered.html'));
    
}







// exports.registeredHomes=registeredHomes;