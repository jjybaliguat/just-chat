import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import connnectDB from './db/connect.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/corsOption.js';
import userRoute from './routes/userRoute.js';
import chatRoute from './routes/chatRoute.js';
import messageRoute from './routes/messageRoute.js';
import cors from 'cors';
import errorhandler from './middleware/errorMiddleware.js';
import { createServer } from "http";
import { Server } from "socket.io";
dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(cors(corsOptions))

app.use("/api/user", userRoute)
app.use("/api/chat", chatRoute)
app.use("/api/message", messageRoute)

app.use(errorhandler)

app.get("/", (req, res)=> {
    res.sendStatus(200)
})

const PORT = process.env.PORT || 5000
const URL = process.env.MONGO_URI

mongoose.set('strictQuery', false)

const httpServer = createServer(app);
const io = new Server(httpServer, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on("setup", (user) => {
        socket.join(user._id)
        socket.emit("connected")
    });

    socket.on('join_chat', (chat) => {
        socket.join(chat)
        console.log("User has joined Chat: " + chat);
    })

    socket.on("typing", (chat) => socket.in(chat).emit("typing"))
    socket.on("typing_stop", (chat) => socket.in(chat).emit("typing_stop"))

    socket.on('new_message', (newMessage) => {
        var chat = newMessage.chat

        if(!chat.users) return console.log('chat.users is not defined')

        chat.users.forEach(user=> {
            console.log(newMessage.message)
            if(user._id == newMessage.sender._id) return;

            socket.in(user._id).emit("message_received", newMessage)
        })
    })

    socket.off("setup", ()=>{
        console.log("User disconnected")
        socket.leave(user._id)
    })
})

httpServer.listen(PORT, async() => {
    try {
        await connnectDB(URL)
        console.log(`Server is Running on port ${PORT}`);
    } catch (error) {
        console.log(error);
    }
})
// const start = async () => {
//     try {
//         await connnectDB(URL)
//         httpServer.listen(PORT, () => {
//             console.log(`Server is Running on port ${PORT}`);
//         })
//     } catch (error) {
//         console.log(error);
//     }
// }

// start()
