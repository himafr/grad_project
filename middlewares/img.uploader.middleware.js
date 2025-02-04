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

const storage = multer.memoryStorage()
  const fileFilter = (req, file, cb) => {
     // Accept PDFs only
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
      cb(null, true); } 
    else {
      cb(new Error('Unsupported photo type! Only PDFs are allowed.'), false); } 
    };
exports.imgUpload = multer({ storage:storage, 
  fileFilter:fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }})


exports.check=(req,res,next)=>{
  if(!req.file)next (new AppError('No file uploaded!',400))
  if(!isAvailable(req.body,Object.values(medicineRequiredFields)))next (new AppError(' medicine required fields not provided'))
  next()
}