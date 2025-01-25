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
  
    const file = req.file;
    console.log("Received file:", file);

    if (file) {
        try {
            const storage = await getLoggedInStorage();
            console.log("Logged into Mega storage");

            file.filename = `${Date.now().toString()}@${req.user?.user_id}${path.extname(file.originalname)}`;
            console.log("Custom file name generated:", file.filename);

            // Create a readable stream from the buffer
            const bufferStream = new Readable();
            bufferStream.push(file.buffer);
            bufferStream.push(null);

            // Upload file to Mega using the stream
            const upload = storage.upload({ name: file.filename, source: bufferStream, size: file.size });

            upload.complete
                .then(() => {
                    console.log("File uploaded successfully:", file.filename);
                    next();
                })
                .catch((err) => {
                    console.error('Error uploading file:', err);
                    res.status(500).send(`Error uploading file: ${err.message}`);
                });

        } catch (error) {
            console.error('Error during the upload process:', error);
            res.status(500).send(`Error uploading file: ${error.message}`);
        }
    } else {
        console.log("No file uploaded");
        res.status(400).send('No file uploaded.');
    }

}
// //  const  file  = req.file;
// //   if (req.file) {
// //       const storage = await getLoggedInStorage();
// //    file.filename=`${Date.now().toString()}@${req.user?.user_id}${path.extname(file.originalname)}`
// //       // Upload file to Mega
// //        await storage.upload({ name:file.filename ,allowUploadBuffering:true},file.buffer).complete
// //         next();
// //     } else {
// //         res.status(400).send('No file uploaded.');
//     }  
// exports.mega = async(req,res,next) => {
//   const { file } = req;
//   if (req.file) {
//       const storage = await getLoggedInStorage();
//       // Upload file to Mega
      
//      await storage.upload({name:file.filename ,data:file.buffer });
//       // Generate a public link for the uploaded file
//  next();
//     } else {
//         res.status(400).send('No file uploaded.');
//     }
// }