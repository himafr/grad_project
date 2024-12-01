const express=require('express')
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const router=express.Router()

router.post('/signup',authController.registerUser)
router.post('/login',authController.loginUser)
router
.route("/")
.get(authController.restrictTo("admin"),userController.getAllUsers)
.post(userController.createUser);

router
.route("/:id")
.get(userController.findUser)
.patch(userController.updateUser)
.delete(userController.deleteUser);
module.exports=router
