import express from "express"
import cors from "cors"
import { connect } from "mongoose"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import http from "http"; // http package in node.js
import {Server} from  "socket.io";

// app config
const app = express()
const port = 4000

//create http server
const server = http.createServer(app);

//create socket.io server
const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
});


// middleware
app.use(express.json())
app.use(cors())


app.use((req, res, next)=>{
    req.io = io;
    next();
});

// check optional socket.io
io.on('connection', (socket) =>{
    console.log('New client connected to socket:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});


// db connection 
connectDB();

// API endpoints

app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

app.get("/",(req,res)=>{
    res.send("API Working")
})

server.listen(port,()=>{
    console.log(`Server & Socket Started on http://localhost:${port}`)
});


