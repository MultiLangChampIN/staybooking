//core module
const path=require('path');

//external module
const express=require('express');
const session=require('express-session')
const MongoDBStore=require('connect-mongodb-session')(session);
const multer=require('multer')

require('dotenv').config();
const DB_PATH=process.env.DB_PATH;



//local module
const storeRouter=require('./routes/storeRouter');
const hostRouter=require('./routes/hostRouter');
const authRouter=require('./routes/authRouter');
const rootDir=require('./utils/pathUtils');
const errorController=require('./controller/error');
// const {mongoConnect}=require('./utils/databaseUtil');
const { default: mongoose } = require('mongoose');
const { root } = require('postcss');



const app=express();

app.set('view engine','ejs');
app.set('views','views');

const store=new MongoDBStore({
    uri:DB_PATH,
    collection:'sessions'
})

const randomString=(length)=>{
    const chars='abcdefghijklmnopqrstuvwxyz';
    let result='';
    for(let i=0; i< length; i++){
        result+=chars.charAt(Math.floor(Math.random()*chars.length))

    }
    return result;
}

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/')
    },
    filename:(req,file,cb)=>{
        cb(null, randomString(10)+'-'+file.originalname)
    }
})

const fileFilter=(req,file,cb)=>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}

const multerOptions={storage,fileFilter}


app.use(express.urlencoded());
app.use(multer(multerOptions).single('photoUrl'))
app.use(express.static(path.join(rootDir,'public')))
app.use('/host/uploads',express.static(path.join(rootDir,'uploads')))
app.use('/uploads',express.static(path.join(rootDir,'uploads')))
app.use('/store/uploads',express.static(path.join(rootDir,'uploads')))



app.use(session({
        secret:"uday pratap at training",
        resave:false,
        saveUninitialized:false,
        store:store,
            
}))

app.use((req,res,next)=>{
    req.isLoggedIn=req.session.isLoggedIn;
    console.log('before auth :',req.isLoggedIn);
    next()
})



app.use(authRouter);


app.use(storeRouter);

app.use('/host',(req,res,next)=>{
    console.log('when using host ',req.isLoggedIn);
        if(req.isLoggedIn){
            next();
        }else{
            res.redirect('/login')

        }
});
app.use('/host',hostRouter);



app.use(errorController.show404)


const PORT = process.env.PORT || 3000;

mongoose.connect(DB_PATH).then(()=>{
    console.log('connected to mongoose');
    app.listen(PORT,()=>{
    console.log(`server runnning on http://localhost:${PORT}`);

    })
}).catch(err=>{
    console.log('db connection failed ',err);
})
