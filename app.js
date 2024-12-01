const express = require("express");
const morgan = require('morgan');
const bodyParser = require('body-parser'); 
const favicon = require('serve-favicon');
const path = require('path');
const app = express();
const userRoute=require('./router/user.routes')
const bookRoute=require('./router/book.routes')
const medRoute=require('./router/medicine.routes')
const AppError=require('./utils/appError')
const globalErrorControllers=require('./controllers/error.controller');
const {Database}=require('./config/db.config');
const { protect } = require("./controllers/auth.controller");

// middlewares 
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true}))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use('/uploads',express.static(`uploads`))
// app.use((req,res,next)=>{
//   req.dateTime=new Date().toLocaleTimeString();
//   next();
// });
app.use(morgan('dev'))

//Routes
// app.get('/as',async(req,res)=>{
//     try{
//         const sql =`SELECT *
//         FROM series 
//         JOIN reviews
//         ON series.id = reviews.series_id
//   `
//         const result = await Database.executeQuery(sql);
//     console.log(result)
//     res.status(200).json({
//         status: "success",
//         data: result
//     })
    
//     } catch(err){
//         console.log(err);
//         res.status(500).json({
//             status: "error",
//             message: "Something went wrong, please try again later."
//         })
//     }
    
// })

app.get("/", protect,(req,res)=>{
    res.send("Hello world");
})
app.use("/api/v1/users",userRoute);
// app.use("/api/v1/meds",protect,
//     medRoute
// );
app.use("/api/v1/books",protect,bookRoute);

app.all("*",(req,res,next)=>{
next(new AppError(`Can't find ${req.originalUrl} on this server`,404))
})

app.use(globalErrorControllers)
module.exports=app