const Storage=require("megajs");
const fs=require("fs").promises;
const path=require("path");
const email = process.env.MEGAMAIL
const password = process.env.MEGAPASS

if (!email || !password) {
    console.error('MEGA_EMAIL and MEGA_PASSWORD environment variables are required');
    process.exit(1);
}

console.log('MEGA_EMAIL and MEGA_PASSWORD environment variables loaded');

const getLoggedInStorage = async () => {
    try {
        const storage = new Storage({ email, password });
        await storage.ready; // Wait for the login to complete
        console.log('Logged into Mega storage');
        return storage;
    } catch (error) {
        console.error('Error logging into Mega storage:', error);
        throw error;
    }
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
        

            // Upload file to Mega using the stream
            const upload = storage.upload({ name: file.filename, size: file.size }, file.buffer,);

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