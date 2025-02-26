const express=require('express')
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const midImg=require("../middlewares/profile.imgs.middleware");
const mg = require("../middlewares/mega.middleware");
const router=express.Router()

router.post('/signup',authController.registerUser)
router.post('/login',authController.loginUser)
router.post("/review/:id", authController.protect,userController.createReview)
router.post('/cover',authController.protect,  midImg.imgUpload.single("cover"),mg.mega,midImg.check,userController.cover)
router.post('/photo',  authController.protect ,midImg.imgUpload.single("photo"),(req,res,next)=>{
    console.log(req.file.buffer)
    next()
},mg.mega,userController.photo)

router.get("/",authController.protect,authController.restrictTo("admin"),userController.getAllUser)
router
.route("/:id")
.get(authController.protect,userController.getUserById)
.patch(authController.protect,userController.updateUser)
// .delete(userController.deleteUser);
module.exports=router
