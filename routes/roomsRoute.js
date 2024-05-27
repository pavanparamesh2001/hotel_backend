const express=require("express");
const router = express.Router();

const Room = require('../Models/room')



  
  
  
 
//1.get all rooms
router.get("/getallrooms",async(req,res)=>{
try{


    const rooms = await Room.find({})
     res.send(rooms)
} catch (error){
return res.status(400).json({message:error});
}
})

router.post("/getroombyid", async (req, res) => {
    const roomid = req.body.roomid; 
    try {
        const room = await Room.findOne({_id : roomid });
        res.send(room);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});
router.post("/addroom", async(req,res)=>{
    try {
        const newroom = new Room(req.body)
        await newroom.save()
        res.send('New Room Added Successfully')
    } catch (error) {
        return res.status(400).json({error}) 
    }
})

// Add delete room endpoint
router.delete("/deleteroom/:id", async (req, res) => {
    try {
        const roomId = req.params.id;
        await Room.findByIdAndDelete(roomId);
        res.send('Room Deleted Successfully');
    } catch (error) {
        return res.status(400).json({ error });
    }
});
// Add update room endpoint
router.put("/updateroom/:id", async (req, res) => {
    try {
        const roomId = req.params.id;
        const updatedRoom = req.body;
        await Room.findByIdAndUpdate(roomId, updatedRoom);
        res.send('Room Updated Successfully');
    } catch (error) {
        return res.status(400).json({ error });
    }
});
module.exports = router;