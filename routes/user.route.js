const { Router } = require('express');

const userRouter = Router();

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

const { UserModel } = require('../model/user.model');

require('dotenv').config()

userRouter.post("/register" , async (req,res)=>{


    const { name , email, password ,age ,gender ,city , is_married } = req.body;

        
    bcrypt.hash(password , 2 , async (err , hash)=>{

        try{

            const user = new UserModel({name ,email,password:hash,age,gender,city,is_married})

            await user.save()

            res.status(200).send(user)

        }

        catch (error) {
        
            res.status(400).send({
                "msg":error.message,
                "msg2":"User Already register with us"
            })
    
        }

    })


})



userRouter.post("/login", async (req,res)=>{

    const {email , password } = req.body;

    try {
        
        const user = await UserModel.findOne({email})

        if(user){

            bcrypt.compare(password , user.password , (err,result)=>{

                if(!result){
                    res.status(400).send({
                        "msg":"Invalid Access. or Wrong password"
                    })
                }

                else{

                    res.status(200).send({
                        "msg":"Login success",
                        "token": jwt.sign({userID:user._id} , process.env.SecretKey , {expiresIn:'180m'})
                    })

                }


            })

        }

        else{

            res.status(400).send({
                "msg":"Kindly Login First"
            })
        }


    } catch (error) {
        
        
        res.status(400).send({
            "msg":error.message
           
        })

    }


})



module.exports = {
    userRouter
}