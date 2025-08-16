require('dotenv').config()
const jwt = require('jsonwebtoken')
const authMiddleware = (req,res,next)=>{

    const authHeader = req.headers['authorization']
    console.log(authHeader);
   
    const token = authHeader && authHeader.split(" ")[1]
    if(!token){
       return res.status(401).json({
           success:false,
           message:'access denied.no Token provided. please login to continue'
       })
    }
    try {
         const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY)
         console.log(decodedToken)

         req.userInfo = decodedToken
         
    next()
       
    } catch (error) {
        res.status(500).json({
               success:false,
               message:'access denied.no Token provided. please login to continue'
        })
    }
 
}

module.exports = authMiddleware