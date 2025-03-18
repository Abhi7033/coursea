const { Router } = require("express");
const userRouter = Router();
const { userModel, purchaseModel } = require("../db")
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");

userRouter.post("/signup", async function(req, res){
    // const email = req.body.email;
    // const password = req.body.password;
    // const firstName = req.body.firstName;
    // const lastName = req.body.lastName;

    //either we can do this or we can do destructuring
    const { email, password, firstName, lastName } = req.body; //TODO: Adding zod validation

    //TODO:hash the password so that we dont have to store the plain text password in the db

    //TODO: Put inside a try catch block
    await userModel.create({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName
    })

    res.json({
        message:"signup succeeded"
    })
})

userRouter.post("/signin", async function(req, res){

    const { email, password } = req.body;

    //ideally the password is hashed so we can not compare the user provided password and database password
    const user = await userModel.findOne({
        email: email,
        password: password
    });

    if(user){
        const token = jwt.sign({
            id: user._id
        }, JWT_USER_PASSWORD);

        //we can put cookie logic here 

        res.json({
            token: token
        })
    }else{
        res.status(403).json({
            message:"Incorrect credentials"
        })
    }  
})

userRouter.get("/purchases", async function(req, res){

    const { email, password } = req.body;
    const purchase = await purchaseModel.find({
        email: email,
        password: password
    })
    res.json({
        message:"purchased course"
    })
})

module.exports = {
    userRouter: userRouter
}