require('dotenv').config();
const cors=require('cors');
const http = require('http');  // Importing http module
const { Database } = require('./config/db.config');

// Uncomment for error handling
// process.on('uncaughtException', err => {
//     console.log("UNCAUGHT EXCEPTION!!!", err.message);
//     process.exit(1);
// });


const socketIo = require('socket.io');
const app = require('./app');
app.use(cors());

const serve = http.createServer(app);
const io = socketIo(serve, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});
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
serve.listen(port, () => console.log(`Server running on ${port}....`));

// Uncomment for error handling
// process.on('unhandledRejection', err => {
//     console.log("UNHANDLED REJECTION!!!", err.message);
//     server.close(() => {
//         process.exit(1);
//     });
// });
