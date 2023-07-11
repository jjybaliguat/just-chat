import asyncHandler from 'express-async-handler'
import Message from '../models/messageModel.js'
import User from '../models/userModel.js'
import Chat from '../models/chatModel.js'

export const composeMessage = asyncHandler(async(req,res)=> {
    const {message, chatId} = req.body

    if(!message || !chatId){
        res.status(400)
        throw new Error("Invalid data passed")
    }

    var newMessage = {
        sender: req.user,
        message: message,
        chat: chatId
    }

    var newMess = await Message.create(newMessage)

    newMess = await newMess.populate("sender", "name email username photo")
    newMess = await newMess.populate("chat")
    newMess = await User.populate(newMess, {
        path: "chat.users",
        select: "name username email photo"
    })

    await Chat.findByIdAndUpdate(req.body.chatId, {
        latestMessages: newMess
    })
    
    res.status(200).json(newMess)
})

export const getAllMessages = asyncHandler(async(req,res)=>{
    try {
        const messages = await Message.find({chat: req.params.chatId}).populate("sender", "name username, email photo").populate("chat")
        res.json(messages)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})