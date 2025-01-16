const AppError=require('../utils/appError')

const handleCastError = err=>{
    const message = `Invalid ${err.path} :${err.value}`
    return new AppError(message,400)
}
const handleDuplicateFieldsDB=err=>{
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
    const message = `Duplicate field value: ${value}. Please use another value.`
    return new AppError(message,400)
}
const handleValidationError=err=>{
    const message = Object.values(err.errors).map(val => val.message)
    // const message = message.length > 0? message.join('. ') : 'Invalid input data.'
    return new AppError(message.join('. '),400)
}
const handleJsonWebTokenError=()=>{
    const message = `Invalid data. Please login again.`
    return new AppError(message,401)
}
const handleTokenExpiredError=()=>new AppError("your token has expired pls log in again !",401)
sendErrorDev=(err,res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        error:err,
        message: err.message,
        stack :err.stack
    })
}
sendErrorPro=(err,res)=>{
    // operational & trusted error send to client
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    }
    // programming or unknown error : don't leak error details
    else {
        console.error("ERROR:",err)
        res.status(500).json({
            status: "error",
            message: "Something went wrong, please try again later."
        })
    }
}
module.exports=(err,req,res,next)=>{
    console.log(1,err)
    err.status=err.status || "Error"
    err.statusCode=err.statusCode ||500

    if(process.env.NODE_ENV ==='production'){
        let error ={...err ,name:err.name,errmsg:err.errmsg}
        if(error.name==="CastError") error = handleCastError(error);
        if(error.code===11000) error=handleDuplicateFieldsDB(error);
        if(error.name==="ValidationError") error = handleValidationError(error);      
        if(error.name==="JsonWebTokenError") error = handleJsonWebTokenError();      
        if(error.name==="TokenExpiredError") error = handleTokenExpiredError();      
        sendErrorPro(error,res)
    }else {
        sendErrorDev(err,res)
    }
}