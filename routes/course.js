const { Router } = require("express");
const courseRouter = Router();

courseRouter.post("/purchase", function(req, res){
    //we would expect the user to pay the money
    res.json({
        message:"purchase course"
    })
})

courseRouter.get("/preview", function(req, res){
    res.json({
        message:"All courses"
    })
})

module.exports = {
    courseRouter: courseRouter
}