//core module
const path=require('path');
const express=require('express');

const storeController=require('../controller/storeController')

const storeRouter=express.Router();

storeRouter.get('/', storeController.getIndex);
storeRouter.get('/home-list', storeController.getHomes);
storeRouter.get('/booking', storeController.getBooking);
storeRouter.get('/favourite-list', storeController.getFavouriteList);
storeRouter.post('/favourite-list', storeController.postAddToFavouriteList);
storeRouter.get('/store/:homeId', storeController.getHomeDetails);
storeRouter.post('/favourites/delete/:homeId', storeController.postUnfavourite);

// storeRouter.get('/reserve', storeController.getReservaetions);

module.exports=storeRouter;