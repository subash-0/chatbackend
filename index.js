const http = require('http');
const express = require('express')
const cors = require('cors')
const socketIO = require('socket.io');

const PORT = 4500 || process.env.PORT;
const app = express();

const users = [{}];
app.use(cors());

app.get('/',(req,res)=>{
    res.send("WOW ! It's working !")
})

const server = http.createServer(app);


const io = socketIO(server);

io.on("connection",(socket)=>{
    console.log('New Connection');
   socket.on('joined',({user})=>{
    users[socket.id] = user;
        console.log(user + " has joined !")
        socket.emit('welcome',{user:'Admin',message:`Welcome to the Chat , ${users[socket.id]}`})
        socket.broadcast.emit("userjoined",{user:"Admin",message:"User Joined the chat"})
   })
   socket.on('message',({message,id})=>{
    io.emit('sentMessage',{user:users[id],message,id});

   })

 socket.on('disconnect',()=>{
    socket.broadcast.emit('leave',{user:'Admin',message:`${users[socket.id]} left the chat`})
    console.log(`${users[socket.id]} has left the chat`);
 })
   
});




server.listen(PORT,()=>{
    console.log(`Server is listening at PORT: ${PORT}`)
})