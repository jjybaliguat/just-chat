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

const start = async () => {
    try {
        await connnectDB(URL)
        app.listen(PORT, () => {
            console.log(`Server is Running on port ${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}

start()