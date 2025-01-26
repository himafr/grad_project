const Storage=require("megajs");
const fs=require("fs").promises;
const path=require("path");
function getLoggedInStorage () {
    // Get credentials from environment variables
    // Don't worry: Deno will prompt if you allow the code to read those variables
    const email = process.env.MEGAMAIL
    const password = process.env.MEGAPASS
  
    // Set up a user-agent
    const userAgent = 'MEGAJS-Demos (+https://mega.js.org/)'
  
    // Create a new storage and return its ready promise
    // (the .ready promise resolves to the storage itself when it's ready
    // so it's a nice shortcut to avoid having to handle the ready event)
    return new Storage({ email, password ,userAgent }).ready
  }
  
exports.getLoggedInStorage = getLoggedInStorage;

exports.mega = async(req,res,next) => {
   const  file  = req.file;
    if (req.file) {
        const storage = await getLoggedInStorage();
     file.filename=`${Date.now().toString()}@${req.user?.user_id}${path.extname(file.originalname)}`
        // Upload file to Mega
         await storage.upload({ name:file.filename ,allowUploadBuffering:true},file.buffer).complete
          next();
      } else {
          res.status(400).send('No file uploaded.');
      }  
}
