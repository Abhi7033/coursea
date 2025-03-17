const { Router } = require("express");
const adminRouter = Router();

adminRouter.post("/signup", function(req, res){
    res.json({
        message:"signup endpoint"
    })
})

adminRouter.post("/signin", function(req, res){
    res.json({
        message:"signin endpoint"
    })
})

adminRouter.post("/course", function(req, res){
    res.json({
        message:"Post courses"
    })
})

adminRouter.put("/course", function(req, res){
    res.json({
        message:"Edit courses"
    })
})

adminRouter.get("/course/bulk", function(req, res){
    res.json({
        message:"All courses"
    })
})

module.exports = {
    adminRouter: adminRouter
}