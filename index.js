const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cors = require("cors");
require('dotenv').config();
const db = require('./config/db')();
const halli = require('./model/halls')
const user = require('./model/user');
const bcrypt = require('bcryptjs');
const Booking = require('./model/booking')
const jwt = require("jsonwebtoken");

//middleware
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/signup', async (req, res) => {
    const users = new user(
        { fullname, email, password, confirmpassword, clubname } = req.body
    )
    if (!fullname || !clubname || !email || !password || !confirmpassword)
        return res.status(400).json({ msg: "Not all fields have been entered." });
    if (password !== confirmpassword)
        return res.status(400).json({ msg: "Passwords doesn't match." });
    if (password.length < 6)
        return res.status(400).json({ msg: "The password needs to be atleast 6 characters long." });
    const existingUser = await user.findOne({ email: email });
    if (existingUser)
        return res.status(400).json({ msg: "An account with this email already exists." });
    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@kongu.edu$/;
        return re.test(String(email).toLowerCase());
    }


    if (validateEmail(email)) {
        try {
            await users.save();
            res.json({ message: "successfully signed" })
            const token = jwt.sign({ id: users._id }, process.env.jwtsecretkey);
            res.status(201).json([
                {
                    token: token,
                    id: users._id,
                    fullname: users.fullname,
                    email: users.email,
                },
            ]);


        } catch {

        }
    } else {
        console.log("Invalid email address");
        res.json("invalid email");
    }


})
app.post("/login", async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        return res.status(400).json({ msg: "Not all fields have been entered." });
    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@kongu.edu$/;
        return re.test(String(email).toLowerCase());
    }


    if (validateEmail(email)) {
        const users = await user.findOne({ email: email })
        if (!users)
            return res.status(400).json({ msg: "No account with this email has been registered." });
        const isMatch = await bcrypt.compare(password, users.password);
        if (!isMatch)
            return res.status(400).json({ msg: "Invalid credentials." });
        res.json({ msg: "logged in" })
    } else {
        res.json("invalid email");
    }
})
app.get('/users',async(req,res)=>{
    const display = await user.find();
    res.json(display);
})
app.get('/seminarhall', async (req, res) => {
    try {
        const users = await halli.find();
        res.status(200).json(users);

    } catch (error) {
        res.status(404).json({ message: error });
    }
})
app.post('/inserthall', (req, res) => {
    const inserthall = new halli(
        { hallname, capacity, projector, whiteboard, location } = req.body
    )
    inserthall.save();
})

// app.use("/api/hall", require("./routes/routes"))
app.post('/bookinghall', async (req, res) => {

    try {
        const existingBooking = await Booking.findOne({
            hallname: req.body.hallname,
            $or: [
                {
                    $and: [
                        { startAt: { $gte: req.body.startAt } },
                        { startAt: { $lte: req.body.endAt } }
                    ]
                },
                {
                    $and: [
                        { endAt: { $gte: req.body.startAt } },
                        { endAt: { $lte: req.body.endAt } }
                    ]
                }
            ]
        });
        // If the hall is already booked, return an error message
        if (existingBooking) {
            return res.status(400).json({
                error: "Hall is already booked for the given dates. Please choose different dates."
            });
        }
        const bookhall = new Booking(
            { hallname, email, startAt, endAt, eventname, clubname, attendees, phonenumber } = req.body
        )
        bookhall.save();
        return res.status(200).json({
            message: "Hall successfully booked."
        })

    } catch(error) {
        return res.status(500).json({
            error: "An error occurred while booking the hall. Please try again later."
        });

    }

})
app.get('/api/booking-requests', (req, res) => {
    Booking.find((error, bookingRequests) => {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(bookingRequests);
      }
    }).sort({ createdAt: 'desc' });
  });
app.put('/api/accept-request/:id', async(req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        console.log(booking);
        if (!booking) {
          return res.status(404).send("Booking not found");
        }
        booking.status = "approved";
        await booking.save();
    
        res.send(booking);
      } catch (err) {
        res.status(400).send(err.message);
      }
  });
  app.put('/api/reject-request/:id', async(req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        console.log(booking);
        if (!booking) {
          return res.status(404).send("Booking not found");
        }
        booking.status = "rejected";
        await booking.save();
    
        res.send(booking);
      } catch (err) {
        res.status(400).send(err.message);
      }
  });
  app.delete('/delete/:id',async(req,res)=>{
    try {
        const deleted = await Booking.findByIdAndRemove(req.params.id);
        res.json(deleted);
    } catch (error) {
       res.status(409).json({ message: error});
        
    }
  })
//   app.get('/displaybookings',(req,res)=>{
//     const booking =  Booking.find();
//     res.json(booking);
//   })
app.listen(4000, () => {
    console.log("listening on the port 4000");
})