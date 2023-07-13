import asyncHandler from 'express-async-handler'
import Chat from '../models/chatModel.js'
import User from '../models/userModel.js'


export const accessChat = asyncHandler(async(req,res)=>{
    const {userId} = req.body

    if(!userId){
        res.sendStatus(400)
    }

    var ChatExist = await Chat.find({
        isGroupChat: false,
        $and: [
            {users: {$elemMatch: {$eq: req.user}}},
            {users: {$elemMatch: {$eq: userId}}}
        ]
    }).populate("users", "-password")
    .populate("latestMessages");

    ChatExist = await User.populate(ChatExist, {
        path: 'latestMessages.sender',
        select: 'name email username photo'
    });

    if(ChatExist.length > 0){
        res.send(ChatExist[0])
    }else{
        var newChatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user, userId]
        };

        try {
            const newChat = await Chat.create(newChatData)
        
            const fetchChat = await Chat.findOne({_id: newChat._id}).populate(
                "users",
                "-password"
            )
            res.status(200).send(fetchChat)
        } catch (error) {
            throw new Error(error.message)
        }
    }
})

export const getAllChats = asyncHandler(async(req,res)=> {
    try {
        const chats = await Chat.find({users: {$elemMatch: {$eq: req.user}}})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessages")
        .sort({updatedAt: -1})
        .then(async (results) => {
            results = await User.populate(results, {
                path: "latestMessages.sender",
                select: "name email username photo"
            });
            res.status(200).send(results)
        })
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

export const createGroupChat = asyncHandler(async(req,res)=> {

    if(!req.body.users || !req.body.chatName){
        res.status(400)
        throw new Error("Please fill all required fields")
    }

    var chatMembers = req.body.users

    if(chatMembers.length < 2){
        res.status(400)
        throw new Error("Please make a group chat of more than two members")
    }

    chatMembers.push(req.user) 

    try {
        const groupChat = await Chat.create({
            chatName: req.body.chatName,
            isGroupChat: true,
            users: chatMembers,
            groupAdmin: req.user
        })

        const constructedGroupChat = await Chat.findOne({_id: groupChat._id})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

        res.status(200).json(constructedGroupChat)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
    
})

export const updateGroup = asyncHandler(async(req,res)=> {
    const {chatId, chatName} = req.body

    try {
        const updateChat =  await Chat.findByIdAndUpdate(chatId, {
            chatName: chatName
        }, {
            new: true
        }
        ).populate("users", "-password")
        .populate("groupAdmin", "-password")
        res.status(200).json(updateChat)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }


})

export const addGroup = asyncHandler(async(req,res)=> {
    const {chatId, users} = req.body

    const chatAdd = await Chat.findByIdAndUpdate(chatId, {
        $push: {
            users: {$each: users}
        },
        },
        {new: true}
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if(!chatAdd){
        res.status(400)
        throw new Error("Something Wen wrong or chat not found")
    }else{
        res.status(200).json(chatAdd)
    }
})

export const removeFromGroup = asyncHandler(async(req,res)=>{
    const {chatId, userId} = req.body

    const chatRemove = await Chat.findByIdAndUpdate(chatId, {
        $pull: {
            users: userId
        },
        },
        {new: true}
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if(!chatRemove){
        res.status(400)
        throw new Error("Something Went wrong or chat not found")
    }else{
        res.status(200).json(chatRemove)
    }
})

export const removeGroup = asyncHandler(async(req,res)=> {
    const {chatId} = req.body

    try {
        const response = await Chat.findByIdAndDelete(chatId)
        res.status(200).json({
            message: 'Group deleted'
        })
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})