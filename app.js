const express = require("express");
const morgan = require('morgan');
const bodyParser = require('body-parser'); 
const favicon = require('serve-favicon');
const path = require('path');
const fsp = require("fs").promises;
const cors=require('cors');
const app = express();
const userRoute=require('./router/user.routes')
const bookRoute=require('./router/book.routes')
const medRoute=require('./router/medicine.routes')
const recipeRoute=require('./router/recipe.routes')
const AppError=require('./utils/appError')
const globalErrorControllers=require('./controllers/error.controller');
const { protect } = require("./controllers/auth.controller");
const mg = require("./middlewares/mega.middleware")
const fetch = require('node-fetch'); // Import fetch
const crypto = require('crypto'); // Import crypto

// Polyfill globalThis.fetch
globalThis.fetch = fetch;

// Polyfill globalThis.crypto
globalThis.crypto = {
    getRandomValues: (buffer) => crypto.randomFillSync(buffer)
};
// const {} = require("deno");

const axios = require('axios');
const { Database } = require("./config/db.config");
// middlewares 
// Parse application/x-www-form-urlencoded
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true}))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
// Initialize Mega SDK

app.use(morgan('dev'));
// Endpoint to handle file stream
app.get('/get/:fileName', async (req, res) => {
  const { fileName } = req.params;
  try {
      const storage = await mg.getLoggedInStorage();

      const file = storage.root.children.find(f => f.name === fileName);
      if (!file) throw new Error('File not found!');

      const downloadStream = file.download();

      // Set appropriate headers
      res.setHeader('Content-Disposition', `attachment; filename=${file.name}`);
      res.setHeader('Content-Type', 'application/octet-stream');

      // Pipe the download stream directly to the response
      downloadStream.pipe(res);

      downloadStream.on('end', () => {
        //   console.log('File streamed successfully:', fileName);
      });

      downloadStream.on('error', (err) => {
          console.error('Error streaming file:', err);
          res.status(500).send(`Error streaming file: ${err.message}`);
      });
      
  } catch (error) {
    console.log(error)
      res.status(500).send(`Error: ${error.message}`);
  }
});

// app.use((req,res,next)=>{
//     setTimeout(next,5000)
// })
  
//Routes
// app.get('/as',async(req,res)=>{
  async function abs(){

    try{
      const sql =`INSERT INTO categories ( category_name)
      VALUES ('وصافات صحيه'),('وصافات عاديه'),('مشروبات')
      `
      const result = await Database.executeQuery(sql);
      console.log(result)
      
      
    } catch(err){
      console.log(err);
     
    }
  } 
    abs();
    // })
    
app.get("/", protect,(req,res)=>{
    res.send("Hello world");
})
app.use("/api/v1/users",userRoute);
app.use("/api/v1/meds",protect,
    medRoute
);
app.use("/api/v1/recipes",protect,
    recipeRoute
);
app.use("/api/v1/books",protect,bookRoute);

app.all("*",(req,res,next)=>{
next(new AppError(`Can't find ${req.originalUrl} on this server`,404))
})

app.use(globalErrorControllers)
module.exports=app