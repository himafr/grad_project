const express=require('express')
const medController = require('../controllers/medicine.controller');
const medMaker=require('../middlewares/img.uploader.middleware');
const authController = require('../controllers/auth.controller');
const router=express.Router()
router
.route("/")
.get(authController.restrictTo('pharmacy'), medController.getAllMeds)
.post(authController.restrictTo('pharmacy'),
    medMaker.imgUpload.single('meds'),
medMaker.check,
medController.createMed);
router
.route("/:id")
.get(medController.getMedById)
.patch(authController.restrictTo('pharmacy'),medController.updateMed)
.delete(authController.restrictTo('pharmacy'),medController.deleteMed);
module.exports=router
