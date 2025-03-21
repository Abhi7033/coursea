const { Router } = require("express");
const userRouter = Router();
const { userModel, purchaseModel, courseModel } = require("../db")
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = require("../config");
const { userMiddleware } = require("../middleware/user");

userRouter.post("/signup", async function(req, res){
    // const email = req.body.email;
    // const password = req.body.password;
    // const firstName = req.body.firstName;
    // const lastName = req.body.lastName;

    //either we can do this or we can do destructuring
    const { email, password, firstName, lastName } = req.body; //TODO: Adding zod validation

    //TODO:hash the password so that we dont have to store the plain text password in the db
    //we will do this later

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

userRouter.get("/purchases", userMiddleware, async function(req, res){

    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId
    })

    const courseData = await courseModel.find({
        _id: { $in: purchases.map(x => x.courseId) }
    })
    
    res.json({
        purchases,
        courseData
    })
})

module.exports = {
    userRouter: userRouter
}