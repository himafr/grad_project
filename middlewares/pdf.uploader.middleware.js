const PDFImage = require("pdf-image").PDFImage;
const multer  = require('multer')
const fs= require('fs')
const path = require('path');
const AppError = require('../utils/appError.js');
const {
  bookRequiredFields
} =require ("../helpers/constants.js");
const {
  isAvailable,
} =require( "../helpers/utils.js");

const storage = multer.diskStorage({
    destination: function (req, file, cb) { 
        const date = new Date();
        const dir=`./uploads/books/${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`
        fs.mkdir(dir,{recursive:true},
            (err)=>{cb(null, dir) }    )
    },
    filename: function (req, file, cb) {
      cb(null, Date.now().toString()+"@"+req.user?.user_id+path.extname(file.originalname)) 
    }
  })
  const fileFilter = (req, file, cb) => {
     // Accept PDFs only
    if (file.mimetype === 'application/pdf'||file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
      cb(null, true); } 
    else {
      cb(new Error('Unsupported file type! Only PDFs are allowed.'), false); } 
    };
exports.bookUpload = multer({ storage:storage,
  fileFilter:fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }
})

exports.img=(req,res,next)=>{
  const pdfImage = new PDFImage(req.file.path);
  pdfImage.convertPage(0).then(function (imagePath) { console.log("First page converted to:", imagePath); }).catch(err=>{
          console.error('Error converting PDF to image:', err); })
  }
exports.check=(req,res,next)=>{
  if(!req.files)next (new AppError('No file uploaded!',400))
  if(!isAvailable(req.body,Object.values(bookRequiredFields)))next (new AppError(' book required fields not provided'))
  next()
} 