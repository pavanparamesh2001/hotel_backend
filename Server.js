require('dotenv').config()
const express =require("express");
const app=express();
require('dotenv').config();
const dbConfig =require('./db')
const roomsRoute=require('./routes/roomsRoute')
const usersRoute=require('./routes/usersRoute')
const bookingsRoute =require('./routes/bookingsRoute')
app.use(express.json())// to receive body 
app.use('/api/rooms', roomsRoute)
app.use('/api/users',usersRoute)
app.use('/api/bookings' , bookingsRoute)
const port =process.env.PORT || 5000;
app.listen(port,()=> console.log(`Node server started using nodemon`));