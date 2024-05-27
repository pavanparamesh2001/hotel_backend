const express = require("express");
const router = express.Router();
const Booking = require('../Models/booking');
const moment = require("moment");
const Room = require('../Models/room')
const { v4: uuidv4 } = require('uuid');
const stripe=require('stripe')('sk_test_51PHnItSIL4Nr6YRvJhDaT6XGNlFadURoh2IUgzW2epY84GvQus85vqC89m3lCC8uEXqq0xAYYrYgBKVRhHTj58pU00ETnDTR3i')

router.post("/bookroom", async (req, res) => {
    const { room, userid, fromDate, toDate, totalamount, totalDays } = req.body;

    try {
        const newBooking = new Booking({
            room: room.name,
            roomid: room._id,
            userid: userid,
            fromDate: moment(fromDate).format('DD-MM-YYYY'),
            toDate: moment(toDate).format('DD-MM-YYYY'),
            totalamount,
            totalDays,
            transactionId: '1234',
        });

        const booking = await newBooking.save();


        const roomtemp =await Room.findOne({_id : room._id})
        roomtemp.currentbookings.push({
            bookingid: booking._id, fromDate: moment(fromDate).format('DD-MM-YYYY'), toDate: moment(toDate).format('DD-MM-YYYY'),
            userid: userid,
            status: booking.status
        })
        await roomtemp.save()
        res.send('Room Booked Successfully');
    } catch (error) {
        return res.status(400).json({ error });
    }
});
router.post('/makepayment', async (req, res) => {
    const { token, totalamount, room, userid, fromDate, toDate, totalDays } = req.body;

    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        });

        const payment = await stripe.charges.create({
            amount: totalamount * 100,
            customer: customer.id,
            currency: 'INR',
            receipt_email: token.email,
            description: `Booking for room: ${room.name}`
        }, {
            idempotencyKey: uuidv4()
        });

        // Handle successful payment
        res.json({ success: true, data: payment });
    } catch (error) {
        console.error('Stripe error:', error);
        return res.status(500).json({ error: 'Payment failed', details: error });
    }
});


router.post("/getbookingsbyuserid" ,async(req,res)=>{
    const userid =req.body.userid

    try {
     const bookings= await Booking.find({userid : userid}) 
     res.send(bookings)  
    } catch (error) {
        return res.status(200).json({error})
    }
})

router.post("/cancelbooking", async(req,res)=>{
    const {bookingid , roomid} =req.body
    try {
       const bookingitem =await Booking.findOne({_id : bookingid}) 

       bookingitem.status='Cancelled'
       await bookingitem.save()
       const room = await Room.findOne({_id : roomid})
        const bookings =room.currentbookings //cancelled booking will be removed from here
        const temp=bookings.filter(booking=>booking.bookingid.toString()!==bookingid)//removing logic
        room.currentbookings=temp
        await room.save()
      res.send('Your booking cancelled Successfully')

    } catch (error) {
        return res.status(400).json({error})
    }
})
router.get("/getallbookings", async(req,res)=>{
    try {
        const bookings =await Booking.find()
        res.send(bookings)
    } catch (error) {
        return res.status(400).json({error}) 
    }
})


module.exports = router;