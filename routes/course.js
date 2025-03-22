const { Router } = require("express");
const { courseModel, purchaseModel } = require("../db");
const { userMiddleware } = require("../middleware/user");
const courseRouter = Router();

courseRouter.post("/purchase", userMiddleware, async function(req, res){

    const userId = req.userId;
    const courseId = req.body.courseId;

    // TODO: we should check the user has already paid the price 
    await purchaseModel.create({
        userId,
        courseId
    })
    //we would expect the user to pay the money
    res.json({
        message:"You have successfully bought the course"
    })
})

courseRouter.get("/preview", async function(req, res){

    const courses = await courseModel.find({});

    res.json({
        courses
    })
})

module.exports = {
    courseRouter: courseRouter
}