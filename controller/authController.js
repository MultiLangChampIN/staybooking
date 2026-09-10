const {check,validationResult} =require("express-validator");
const User = require("../models/user");
const bcrypt=require('bcryptjs')
// const session=require('express-session')
// const MongoDBStore=require('connect-mongodb-session')(session);


exports.getLogin=(req,res,next)=>{
    console.log({
        pageTitle:'login page',
        currentPage:'login',
        isLoggedIn:false,
    });
    
    res.render("auth/login",{
        pageTitle:'login page',
        currentPage:'login',
        isLoggedIn:false,
        errors:[],
        oldInput: {email:""},
        user:{}
        
        
       
    });
   

}


exports.getSignup=(req,res,next)=>{
    console.log({
        pageTitle:'signup page',
        currentPage:'login',
        isLoggedIn:false
    });
    
    res.render("auth/signup",{
        pageTitle:'signup page',
        currentPage:'login',
        isLoggedIn:false,
        errors:[],
        oldInput:{
            firstName:"",
            lastName:"",
            email:"",
            userType:"",
        },
        user:{}
        
    });
}

exports.postSignup=[
    check("firstName")
    .trim()
    .isLength({min:2})
    .withMessage('first name must be atleast of 2  characters long')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('first name can only contain alphabets'),
    
    check("lastName")
    .matches(/^[A-Za-z\s]*$/)
    .withMessage('last name can only contain alphabets'),

    check('email')
    .isEmail()
    .withMessage('please enter valid email')
    .normalizeEmail(),

    check('password')
    .isLength({min:5})
    .withMessage('password  should be minimum of 5 character')
    .matches(/[A-Z]/)
    .withMessage('atleast one upper case in passsword')
    .matches(/[a-z]/)
    .withMessage('atleast one lowwer case in password')
    .matches(/[!@&]/)
    .withMessage('password must contain atleast one speacial character')
    .trim(),

    check('confirm-password')
    .trim()
    .custom((value,{req})=>{
        if(value!==req.body.password){
            throw new Error('password do not match')
        }
        return true
    }),

    check('userType')
    .notEmpty()
    .withMessage('user type is required')
    .isIn(['guest','host'])
    .withMessage('invalid user type'),

    check('terms')
    .notEmpty()
    .withMessage("please accept the terms and condition")
    .custom((value,{req})=>{
        if (value!=="on"){
          throw new Error("please accept the terms and condition")  
        }
            
        return true
    }),


    (req,res,next)=>{
    console.log(req.body);
    const {firstName,lastName,email,password,userType}=req.body;
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).render("auth/signup",{
            pageTitle:'sign up',
            currentPage:'login',
            isLoggedIn:false,
            errors:errors.array().map(err=>err.msg),
            oldInput:{firstName,lastName,email,password,userType},
            user:{}
        })

    }
    bcrypt.hash(password , 12).then(hashedPassword =>{
        const user =new User ({firstName,lastName,email,password:hashedPassword,userType})
        return user.save();

    }).then(()=>{

        res.redirect('/login')

    }).catch(err=>{
        console.log('error occured while saving user data',err);
        return res.status(422).render("auth/signup",{
            pageTitle:'sign up',
            currentPage:'login',
            isLoggedIn:false,
            errors:[err.message],
            oldInput:{firstName,lastName,email},
            user:{}
        })

    })

}]

exports.postLogin= async (req,res,next)=>{

    const {email,password}=req.body;

    const user = await User.findOne({email});
    
    if(!user){
        return res.status(422).render("auth/login",{
            pageTitle:'login',
            currentPage:'login',
            isLoggedIn:false,
            errors:['user does not exist'],
            oldInput:{email},
            user:{}
        })
    }

    const isMatch= await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(422).render("auth/login",{
            pageTitle:'login',
            currentPage:'login',
            isLoggedIn:false,
            errors:['invalid password'],
            oldInput:{email},
            user:{}
        })
    }
    
    console.log('logging in setting true');

    req.session.isLoggedIn=true;
    req.session.user = 
    {
    _id: user._id.toString(),
    email: user.email,
    name: user.firstName,
    userType:user.userType // add other simple fields if needed
}



    await req.session.save()
    console.log('hello',req.session.user,req.session.isLoggedIn);
    res.redirect("/")
    // console.log('hello',req.session.user,req.session.isLoggedIn);
}



exports.postLogout=(req,res,next)=>{
    
    
    req.session.destroy(()=>{
        res.redirect('/login')
    })
}
    