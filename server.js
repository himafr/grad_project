require('dotenv').config();
const { Database } = require('./config/db.config');
const app = require('./app');
const http = require('http').createServer(app);  
const socketIo=require('socket.io')(http,{
    cors:{
        origin:"*"
    }
});
// Importing http module

// Uncomment for error handling
// process.on('uncaughtException', err => {
    //     console.log("UNCAUGHT EXCEPTION!!!", err.message);
    //     process.exit(1);
    // });
    
    

 
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




const port = process.env.PORT || 3000;
http.listen(port, () => {console.log(`Server running on ${port}....`)
    socketIo.on('connect', (socket) => {
    
        console.log('a user connected');
    
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    
        socket.on('user active', async (user) => {
            console.log(user)
            const userActivity = await Database.executeQuery(`UPDATE users SET last_active = NOW() WHERE user_id = ?`,[user.userId])
        
        });
    });

});

// Uncomment for error handling
// process.on('unhandledRejection', err => {
//     console.log("UNHANDLED REJECTION!!!", err.message);
//     server.close(() => {
//         process.exit(1);
//     });
// });
