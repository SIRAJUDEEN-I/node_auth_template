const { default: mongoose } = require('mongoose')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
require('dotenv').config()

const registerUser = async(req,res)=>{
    try {
        const {username,email,role,password} = req.body
        console.log('erq received')
        const checkExistingUsername = await User.findOne({username})
        const checkExistingEmail = await User.findOne({email})
   
        if(checkExistingUsername){
             return res.status(400).json({
                success:false,
                message:'username already exists please try differnt username'
            })
        }
        if(checkExistingEmail){
             return res.status(400).json({
                success:false,
                message:'email already exists please login or try diffret email'
            })
        }


        //hash the password 
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newlyCreatedUser = await User.create({
            username,email,password:hashedPassword,role:role || "user",

        })

      
        if(newlyCreatedUser){
            return res.status(201).json({
                success:true,
                message:'user created successfully'
            })
        }


        mongoose.connection.close()

    } catch (err) {
        console.log(err)

        return res.status(500).json({
            success:false,
            message:'error please try again'
        })
    }
}

const loginUser = async(req, res)=>{
    try {
        const {username,password,email} = req.body

       
        const existingUser = username ? await User.findOne({username}) : await User.findOne({email})
        
        console.log(existingUser)
        if(!existingUser){
            return res.status(404).json({
                success:false,
                message:'username or email doesn\'t exist'
            })
        }

        const isPasswordMatch = await bcrypt.compare(password,existingUser.password)

        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message:'incorrect password'
            })
        }

          const accessToken = jsonwebtoken.sign({
            userId:existingUser._id,
            username:existingUser.username,
            role:existingUser.role
        },process.env.JWT_SECRET_KEY,{
            expiresIn:'15m'
        })

        res.status(200).json({
            success:'true',
            message:'logged in successfully',
            accessToken
        })


        
    } catch (err) {
        console.log(err)

        return res.status(500).json({
            success:false,
            message:'error  please try again'
        })
    }
}



module.exports = {loginUser,registerUser}