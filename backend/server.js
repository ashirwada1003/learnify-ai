require('dotenv').config();
const http = require('http');
const app = require("./app");
const connectDB = require("./src/config/db");
const { Server } = require('socket.io');

connectDB();

const server = http.createServer(app);

// NEW — attach Socket.io to the same server, allow connections from any frontend origin
const io = new Server(server,{
    cors:{origin:"*"}
});

// NEW — whenever a new client (frontend) connects, log it
io.on('connection',(socket)=>{
    console.log('A user connected:',socket.id);

    socket.on('disconnect',()=>{
        console.log('A user disconnected:',socket.id);
    });
});

//New - make io accessible from anywhere else in the app(controllers included)
app.set('io',io);


const PORT = process.env.PORT || 5000;

server.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
});