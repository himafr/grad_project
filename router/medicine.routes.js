const express=require('express')
const medController = require('../controllers/medicine.controller');
const medMaker=require('../middlewares/img.uploader.middleware');
const router=express.Router()
router
.route("/")
.get(medController.getAllMeds)
.post(
    medMaker.imgUpload.single('meds'),
medMaker.check,
medController.createMed);
router
.route("/:id")
.get(medController.getMedById)
.patch(medController.updateMed)
.delete(medController.deleteMed);
module.exports=router
