const express = require("express");
const morgan = require('morgan');
const bodyParser = require('body-parser'); 
const favicon = require('serve-favicon');
const path = require('path');
const cors=require('cors');
const app = express();
const userRoute=require('./router/user.routes')
const bookRoute=require('./router/book.routes')
const medRoute=require('./router/medicine.routes')
const AppError=require('./utils/appError')
const globalErrorControllers=require('./controllers/error.controller');
const {Database}=require('./config/db.config');
const { protect } = require("./controllers/auth.controller");
const fs = require("fs");

// middlewares 
// Parse application/x-www-form-urlencoded
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true}))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.get('/tmp/:id', (req, res) => {
    const filePath = `${__dirname}/tmp/${req.params.id}`;
    console.log(filePath);
  
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        res.status(404).send(`File not found + ${filePath}`);
      } else {
        res.sendFile(filePath);
      }
    });
  });
// app.use(morgan('dev'))
const upload = multer({ dest: 'pp/' });

// Endpoint to handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        res.status(200).send(`File uploaded successfully: ${req.file.filename}`);
    } else {
        res.status(400).send('No file uploaded.');
    }
});
// app.use((req,res,next)=>{
//     setTimeout(next,3000)
// })
  
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
app.use("/api/v1/meds",protect,
    medRoute
);
app.use("/api/v1/books",protect,bookRoute);

app.all("*",(req,res,next)=>{
next(new AppError(`Can't find ${req.originalUrl} on this server`,404))
})

app.use(globalErrorControllers)
module.exports=app