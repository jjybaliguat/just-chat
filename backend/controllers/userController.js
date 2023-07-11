import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

export const registerUser = asyncHandler(async(req, res)=> {
    let {name, email, username, password} = req.body

    if(!name || !email || !username || !password){
        res.status(400)
        throw new Error("Please fill all required fields")
    }

    const emailExist = await User.findOne({email})
    if(emailExist){
        res.status(400)
        throw new Error("Email already exist")
    }
    const user = await User.create(req.body)
    if(user){
        const {_id, name, email, username, photo} = user
        res.status(201).json({
            _id, name, email, username, photo
        })
    }
})


export const loginUser = asyncHandler(async(req,res)=> {
    const {username, password} = req.body
    const token_secret = process.env.TOKEN_SECRET
    const refresh_secret = process.env.RERESH_SECRET

    if(!username || !password){
        res.status(400)
        throw new Error('Please enter username or password')
    }

    const user = await User.findOne({username}).exec()

    if(!user){
        res.status(400)
        throw new Error("Account not found")
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if(user && isPasswordCorrect){
        //generate token

        const token = jwt.sign({
            "User": {
                "id": user._id,
            },
        },
        token_secret,
        {expiresIn: '15m'}
        )

        //send HTTP-only cookie
        const refreshToken = jwt.sign({
            "id": user._id
        },
        refresh_secret,
        {expiresIn: '1d'}
        )

        res.cookie("jwt", refreshToken, {
            path: "/",
            expires: new Date(Date.now() + 1000 * 604800), //1day
            httpOnly: true,
            secure: true,
            sameSite: "none"
        })

        const {_id, name, username, email, photo} = user
        res.status(200).json({
            user: {
                _id,
                name,
                username,
                email,
                photo
            },
            token: token
        })
    }else{
        res.status(400)
        throw new Error("Invalid Email or Password")
    }
    
})