const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth-middleware')
const adminMiddleware = require('../middleware/admin-middleware')

router.get('/welcome',authMiddleware,adminMiddleware,(req,res)=>{
    res.status(200).json({
        success:true,
        message:'welcome to the home'
    })
})

module.exports = router