const mongo=require('mongodb');
const mongoClient=mongo.MongoClient;
const mongo_url="mongodb+srv://root:root@base1.tcd0oid.mongodb.net/?appName=base1";

let _db;

const mongoConnect=(callback)=>{
    mongoClient.connect(mongo_url)
        .then((client)=>{
            console.log("connect to mongoDb");
            callback(client);
            _db=client.db('airbnb')

        })
        .catch((err)=>{
            console.log('error while connecting to mongoDb',err);
        })
}

const getDb=()=>{
    if(!_db){
        throw new Error('Mongo not connected ')
    }
    return _db;

}


exports.mongoConnect=mongoConnect;
exports.getDb=getDb;
