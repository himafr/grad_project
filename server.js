require('dotenv').config();
const http = require('http');  // Importing http module
const { Database } = require('./config/db.config');

// Uncomment for error handling
// process.on('uncaughtException', err => {
//     console.log("UNCAUGHT EXCEPTION!!!", err.message);
//     process.exit(1);
// });


const {Server} = require('socket.io');
const app = require('./app');

const server = http.createServer(app)
 const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ["GET", "POST"],
      // allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  })
// const serve = http.createServer(app);
// const io = socketIo(serve, {
//     cors: {
//         origin: '*', // Allows requests from any origin
//         methods: ['GET', 'POST'], // Allows GET and POST methods
//         allowedHeaders: ['Authorization', 'Content-Type'], // Allows specific headers
//         credentials: true // Allows credentials (cookies, authorization headers, etc.)
//     }
// });

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
const activeUsers=[2,2];

io.on('connect', (socket) => {
    
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('user active', async (user) => {
        console.log(user)
        const userActivity = await Database.executeQuery(`UPDATE users SET last_active = NOW() WHERE user_id = ?`,[user.userId])
    
    });
});


const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server running on ${port}....`));

// Uncomment for error handling
// process.on('unhandledRejection', err => {
//     console.log("UNHANDLED REJECTION!!!", err.message);
//     server.close(() => {
//         process.exit(1);
//     });
// });
