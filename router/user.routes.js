const express=require('express')
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const midImg=require("../middlewares/profile.imgs.middleware")
const router=express.Router()

router.post('/signup',authController.registerUser)
router.post('/login',authController.loginUser)
router.post('/cover',authController.protect,  midImg.imgUpload.single("cover"),midImg.check,userController.cover)
router.post('/photo',  authController.protect ,midImg.imgUpload.single("photo"),(req,res,next)=>{
    console.log("before checking")
    next()
},midImg.check,(req,res,next)=>{
    console.log("after checking")
    next()
},userController.photo)

// router
// .route("/")
// .get(authController.protect, authController.restrictTo("admin"),userController.getAllUsers)
// .post(userController.createUser);

router
.route("/:id")
.get(authController.protect,userController.getUserById)
.patch(authController.protect,userController.updateUser)
// .delete(userController.deleteUser);
module.exports=router
