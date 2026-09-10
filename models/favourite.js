

const mongoose=require('mongoose')

const favSchema=mongoose.Schema({
   homeId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Home',
    required:true,
    unique:true
   }
});


module.exports=mongoose.model('Favourite',favSchema)


// module.exports=class Favourite{
//     constructor(homeId){
//         this.homeId=homeId
//     }

//     save(){
//          const db=getDb()
//          return db.collection('favourites').findOne({homeId:this.homeId}).then(existingFav=>{
//             if(!existingFav){
//                  return db.collection('favourites').insertOne(this)
//             }
//             return  Promise.resolve()
//          })
       

//     }


//     static getFavourites(){
//         const db=getDb();
//         return db.collection('favourites').find().toArray()
        

//     }

//     static deleteHomeById(delHomeId){
//         const db=getDb();
//         return db.collection('favourites').deleteOne({homeId:delHomeId})
       
            
//     }
// }
