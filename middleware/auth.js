require('dotenv').config();

const jwt = require('jsonwebtoken');


const Auth = (req,res,next)=>{

    if(!req.headers['authorization']){
        return res.status(400).send({
            "msg":"Invalid Acess"
        })
    }

    const token = req.headers['authorization'].split(' ')[1];

    if(token){

        try {
            
            const decoded = jwt.verify(token , process.env.SecretKey);

            if(decoded){

                req.body.userID = decoded.userID
                next()

            }

            else{
                res.status(400).send({
                    "msg":"Kindly login first"
                })
            }


        } catch (error) {
            res.status(400).send({
                "msg":"Invalid Acess"
            })
        }

    }

}

module.exports = {
    Auth
}