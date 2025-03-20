const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db")
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { adminMiddleware } = require("../middleware/admin");

adminRouter.post("/signup", async function(req, res){

    const { email, password, firstName, lastName } = req.body; //TODO: Adding zod validation

    //TODO:hash the password so that we dont have to store the plain text password in the db

    //TODO: Put inside a try catch block
    await adminModel.create({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName
    })

    res.json({
        message:"signup succeeded"
    })
})

adminRouter.post("/signin", async function(req, res){

    const { email, password } = req.body;

    //ideally the password is hashed so we can not compare the admin provided password and database password
    const admin = await adminModel.findOne({
        email: email,
        password: password
    });

    if(admin){
        const token = jwt.sign({
            id: admin._id
        }, JWT_ADMIN_PASSWORD);

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

adminRouter.post("/course", adminMiddleware, async function(req, res){
    const adminId = req.userId;

    const { title, description, imageUrl, price } = req.body;
    const course = await courseModel.create({
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        creatorId: adminId
    })

    res.json({
        message:"course created",
        courseId: course._id
    })
})

adminRouter.put("/course", adminMiddleware, async function(req, res){
    const adminId = req.userId;

    const { title, description, imageUrl, price, courseId } = req.body;

    const course = await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId
    },{
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        creatorId: adminId
    })

    res.json({
        message:"course updated",
        courseId: course._id
    })
})

adminRouter.get("/course/bulk", adminMiddleware, async function(req, res){
    const adminId = req.userId;

    const courses = await courseModel.find({
        creatorId: adminId
    });

    res.json({
        message:"All courses",
        courses
    })
})

module.exports = {
    adminRouter: adminRouter
}