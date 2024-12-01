const poppler = require('pdf-poppler');
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
      cb(null, Date.now().toString()+"@"+req.user?.id+path.extname(file.originalname)) 
    }
  })
  const fileFilter = (req, file, cb) => {
     // Accept PDFs only
    if (file.mimetype === 'application/pdf' ) {
      cb(null, true); } 
    else {
      cb(new Error('Unsupported file type! Only PDFs are allowed.'), false); } 
    };
exports.bookUpload = multer({ storage:storage,
  fileFilter:fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }})

exports.img=(req,res,next)=>{
  const options = {
      format: 'png',
      out_dir: './'+req.file.path.split("\\").slice(0,-1).join("/"),
      out_prefix: path.basename(req.file.filename.split('.').slice(0,-1).join(''), '.png'),
      page: 1,
      poppler_path: './'
  }; 
  
   poppler.convert(req.file.path, options).then(()=>{
       next();
   }).catch(err=>{
          console.error('Error converting PDF to image:', err); })
  }
exports.check=(req,res,next)=>{
  if(!req.file)next (new AppError('No file uploaded!',400))
  if(!isAvailable(req.body,Object.values(bookRequiredFields)))next (new AppError(' book required fields not provided'))
  next()
}