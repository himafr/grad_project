const express=require('express')
const bookController = require('../controllers/book.controller');
const authController = require('../controllers/auth.controller');
const pdfMaker=require('../middlewares/pdf.uploader.middleware');
const router=express.Router()
router
.route("/")
.get(bookController.getAllBooks)
.post(authController.restrictTo("admin"), pdfMaker.bookUpload.single('pdf'),
pdfMaker.check
,pdfMaker.img
,bookController.createBook);
router
.route("/:id")
.get(bookController.getBookById)
.patch(authController.restrictTo("admin"), bookController.updateBook)
.delete(authController.restrictTo("admin"),bookController.deleteBook);
module.exports=router