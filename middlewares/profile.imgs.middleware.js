const multer  = require('multer')
const fs= require('fs')
const path = require('path');
const AppError = require('../utils/appError.js');
const {
  medicineRequiredFields
} =require ("../helpers/constants.js");
const {
  isAvailable,
} =require( "../helpers/utils.js");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const date = new Date();
        const dir=`/temp/uploads/profile/${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`
        fs.mkdir(dir,{recursive:true},
            (err)=>{cb(null, dir) }    )
    },
    filename: function (req, file, cb) {
      console.log(req.user.user_id)
      cb(null, Date.now().toString()+"@"+req.user?.user_id+path.extname(file.originalname)) 
    }
  })
  const fileFilter = (req, file, cb) => {
     // Accept PDFs only
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'||file.mimetype === 'image/webp' ) {
      cb(null, true); } 
    else {
      cb(new Error('Unsupported photo type! Only images are allowed.'), false); } 
    };
exports.imgUpload = multer({ storage:storage, 
  fileFilter:fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }})


exports.check=(req,res,next)=>{
  if(!req.file)next (new AppError('No file uploaded!',400))
  next()
}