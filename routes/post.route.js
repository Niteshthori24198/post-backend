const { PostModel } = require('../model/post.model');

const { Router } = require('express');

const postRouter = Router();



postRouter.post("/add" , async (req,res)=>{


    // const { userID } = req.body;

    try {
        
        const post = new PostModel(req.body)

        await post.save()

        res.status(200).send(post)

    } 
    
    catch (error) {
        
        res.status(400).send({
            "msg":error.message,
            "msg2":"User Already register with us"
        })


    }


})





postRouter.patch("/update/:postID" , async (req,res)=>{

    const {postID} = req.params;

    try{

        const verifypost = await PostModel.find({_id:postID})

        if(verifypost.userID === req.headers.userID){

            await PostModel.findByIdAndUpdate({_id:postID} , req.body)

            const updatedpost = await PostModel.find({_id:postID})

            res.status(200).send(updatedpost)
        }

        else{

            res.status(400).send({
                "msg":"Unauthorize access detected."
            })

        }

    }

    catch(error){

        res.status(400).send({
            "msg":error.message
        })
    }


})



postRouter.delete("/delete/:postID" , async (req,res)=>{

    const {postID} = req.params;

    try{

        const verifypost = await PostModel.find({_id:postID})

        if(verifypost.userID === req.headers.userID){

            await PostModel.findByIdAndDelete({_id:postID})

            res.status(200).send({
                "msg":"post deleted successfully"
            })
        }

        else{

            res.status(400).send({
                "msg":"Unauthorize access detected."
            })

        }

    }

    catch(error){

        res.status(400).send({
            "msg":error.message
        })
    }


})



postRouter.get("/top", async (req,res)=>{

    try {

        const posts = await PostModel.find({userID:req.body.userID});
        console.log(posts)

        let id;
        let maxcomment = -Infinity;

        for(let i=0;i<posts.length;i++){
            if(maxcomment < posts[i].no_of_comments){
                maxcomment  = posts[i].no_of_comments;
                id=posts[i]._id;
            }
        }

        console.log(id,maxcomment)

        const post =  await PostModel.find({_id:id});

        res.status(200).send(post);

        
    } catch (error) {
        res.status(400).send({
            "msg":error.message
        })
    }

})



postRouter.get("/posts", async (req,res)=>{

    const { device , device1 , device2  , min , max , Limit, page } = req.query;

    let l=+Limit;

    if(l>3){
        l=3;
    }

    try {
        
        if(device){
           const post1 = await PostModel.find({userID:req.body.userID,device:device}).skip(l*(+page-1)).limit(l)
            res.status(200).send(post1)
        }
        else if(device1 && device2) {
            
            const post2 =await PostModel.find({userID:req.body.userID,device:device1 , device:device2}).skip(l*(page-1)).limit(l)
            res.status(200).send(post2)
        }

        else if(min && max){
            const post3 =await PostModel.find({userID:req.body.userID, no_of_comments:{$gte: +min , $lte: +max}}).skip(l*(+page-1)).limit(l)
            res.status(200).send(post3)
        }

        else{
            const post = await PostModel.find({userID:req.body.userID}).skip(l*(page-1)).limit(l);
            res.status(200).send(post)
        }

    } catch (error) {

        res.status(400).send({
            "msg":error.message
        })

    }


})




module.exports = {
    postRouter
}