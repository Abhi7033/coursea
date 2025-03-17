const { Router } = require("express");
const courseRouter = Router();

courseRouter.post("/course/purchase", function(req, res){
    //we would expect the user to pay the money
    res.json({
        message:"purchase course"
    })
})

courseRouter.get("/course/preview", function(req, res){
    res.json({
        message:"All courses"
    })
})

module.exports = {
    courseRouter: courseRouter
}