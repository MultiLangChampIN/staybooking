
const mongoose=require('mongoose');
// const favourite = require('./favourite');

const homeSchema=mongoose.Schema({
    houseName:{type:String,required:true},
    location:{type:String,required:true},
    pricePerNight:{type:String,required:true},
    rating:{type:String,required:true},
    photoUrl:{type:String,required:true},
    description:String,
});

// homeSchema.pre('findOneAndDelete', async function(next){
//     console.log('came to pre hook while deleting home');
//     const homeId=this.getQuery()["_id"];
//     await favourite.deleteMany({homeId:homeId})/
//     next()
  
// })

module.exports=mongoose.model('Home',homeSchema)


/**
 

        save()
        static find()
        static findById(homeId)
         static deleteHomeById(homeId)

 */

