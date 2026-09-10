
const Home=require("../models/homes");
const User=require("../models/user");


exports.getIndex =  (req, res, next) => {
   
        console.log('session value :',req.session,req.session.isLoggedIn,req.session.user);
        console.log({ pageTitle: 'home AriBnb', currentPage: 'index'});
        res.render('store/index',{pageTitle: 'home AriBnb', currentPage: 'index' ,isLoggedIn:req.isLoggedIn, user:req.session.user});




}
exports.getHomes = (req, res, next) => {
    Home.find().then(registeredHomes => {

        console.log({ registeredHomes: registeredHomes, pageTitle: 'home list', currentPage: 'home-list',isLoggedIn:req.isLoggedIn });
        res.render('store/home-list', { registeredHomes: registeredHomes, pageTitle: 'home list', currentPage: 'home-list',isLoggedIn:req.isLoggedIn ,user:req.session.user});

    });


}
exports.getBooking = (req, res, next) => {
    

        console.log( {pageTitle: 'Booking', currentPage: 'booking' });
        res.render('store/booking', {pageTitle: 'Booking', currentPage: 'booking',isLoggedIn:req.isLoggedIn ,user:req.session.user});

    };

exports.getFavouriteList = async (req, res, next) => {
        const userId= req.session.user._id;
        const user=await User.findById(userId).populate('favourites');
  

            console.log({ pageTitle: 'list of favourite airbnb', currentPage: 'favourite-list'});

            res.render('store/favourite-list',{
                favouriteHomes: user.favourites,
                pageTitle: 'list of favourite airbnb',
                currentPage: 'favourite-list',
                isLoggedIn:req.isLoggedIn,
                user:req.session.user
            });

        
         


};

exports.postAddToFavouriteList = async (req, res, next) => {
    const homeId=req.body.id;
    const userId=req.session.user._id;
    const user= await User.findById(userId);
    if(!user.favourites.includes(homeId)){
        user.favourites.push(homeId);
        await user.save()
    }
    res.redirect('/favourite-list')  
    

 
}

exports.postUnfavourite = async (req, res, next) => {
    const delHomeId=req.params.homeId;
    const userId=req.session.user._id;
    const user= await User.findById(userId);
    console.log("came to remove from favourite",delHomeId);
    if (user.favourites.includes(delHomeId)){
        user.favourites=user.favourites.filter(favHome=>favHome !=delHomeId)
        await user.save()
    }
    
        res.redirect('/favourite-list');
   
}

        


exports.getHomeDetails = (req, res, next) => {
    const homeId=req.params.homeId;

    console.log('home details for id:',homeId);
    Home.findById(homeId).then(homes=>{
        const home=homes
        if (!home){
            console.log("home not found");
            res.redirect("/home-list")
        }else{
            console.log("home details found",home);
        res.render('store/home-details', { home:home, pageTitle: 'Home details', currentPage: 'home-list',isLoggedIn:req.isLoggedIn,user:req.session.user})

        }
        
    });
    

}
// exports.registeredHomes=registeredHomes;