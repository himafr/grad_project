const express=require('express')
const bookController = require('../controllers/book.controller');
const authController = require('../controllers/auth.controller');
const pdfMaker=require('../middlewares/pdf.uploader.middleware');
const { megaBook } = require('../middlewares/mega.middleware');
const router=express.Router()
router.post("/comments/:id",bookController.createComment)
router.post("/review/:id",bookController.createReview)
router
.route("/")
.get(bookController.getAllBooks)
.post(authController.restrictTo("admin"),
 pdfMaker.bookUpload.fields([{name:"pdf",maxCount:1},{name:"image",maxCount:1}]),
pdfMaker.check,
megaBook
,bookController.createBook);
router
.route("/admin")
.get(bookController.getAdminBooks)
router
.route("/:id")
.get(bookController.getBookById)
.patch(authController.restrictTo("admin"), bookController.updateBook)
.delete(authController.restrictTo("admin"),bookController.deleteBook);
module.exports=router
