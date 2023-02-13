// const express = require("express")
// const router = express.Router()
// const auth = require("../middleware/auth")
// const User = require("../model/user")
// const Hall = require("../model/halls")
// const Booking = require('../model/booking')
// const { check, validationResult } = require("express-validator")

// router.post(
//     "/:hall_id",
//     [
//       auth,
//       [
//         check("startAt", "Starting Date of Booking is required").not().isEmpty(),
//         check("endAt", "Ending Date of Booking is required").not().isEmpty(),
//       ],
//     ],
//     async (req, res) => {
//       const errors = validationResult(req)
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }
  
//       try {
//         if (req.body.startAt < req.body.endAt) {
//           const user = await User.findById(req.user.id).select("-password")
//           const hall = await Hall.findById(req.params.hall_id).populate(
//             "booking"
//           )
//           const bookingFields = {
//             startAt: req.body.startAt,
//             endAt: req.body.endAt,
//             clubame: user.clubName,
//             fullname: user.fullname,
//             email: user.email,
//             user: req.user.id,
//             hall: req.params.hall_id,
//             hallname: hall.hallname,
//           }
  
//           const newBooking = new Booking(bookingFields)
//           if (validBooking(hall, newBooking)) {
//             hall.bookings.push(newBooking)
//             await newBooking.save()
//             await hall.save()
//             res.status(200).json(newBooking)
//           } else {
//             return res.status(404).json({
//               errors: [
//                 { title: "Invalid Booking", msg: "Booking already exists" },
//               ],
//             })
//           }
//         } else {
//           return res.status(404).json({
//             errors: [
//               { title: "Invalid Booking", msg: "PLease input Valid dates" },
//             ],
//           })
//         }
//       } catch (err) {
//         console.error(err.message)
//         res.status(500).send("Server Error")
//       }
//     }
//   )

//   module.exports=router