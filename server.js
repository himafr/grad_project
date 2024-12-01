const {Database}=require("./config/db.config")
// process.on('uncaughtException',err=>{
//     console.log("UNCAUGHT EXCEPTION!!!",err.message);
//     process.exit(1)  
// })
require('dotenv').config()
const app=require('./app')


port = process.env.PORT||3000;
const server =app.listen(port, () => console.log(`server running on ${port}....`));
process.on('unhandledRejection',err=>{
    console.log("UNHANDLED REJECTION!!!",err.message);
    server.close(()=>{
        process.exit(1)
    })
})
