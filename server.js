require('dotenv').config();
const { Database } = require('./config/db.config');

// Uncomment for error handling
// process.on('uncaughtException', err => {
//     console.log("UNCAUGHT EXCEPTION!!!", err.message);
//     process.exit(1);
// });


const app = require('./app');





const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}....`));

// Uncomment for error handling
// process.on('unhandledRejection', err => {
//     console.log("UNHANDLED REJECTION!!!", err.message);
//     server.close(() => {
//         process.exit(1);
//     });
// });
