const express = require('express');

const { userRouter } = require('./routes/user.route')

const { postRouter } = require('./routes/post.route')

const { connection } = require('./db');

// const cors = require('cors');

const { Auth } = require('./middleware/auth')

const app = express();

require('dotenv').config()

app.use(express.json())

// app.use(cors())

app.use("/user" , userRouter);

app.use(Auth);

app.use("/posts" , postRouter);


app.listen(process.env.port , async ()=>{

    try {

        await connection;

        console.log(`connected to db. server is running at ${process.env.port}`)

    } catch (error) {

        console.log(error)

    }

})