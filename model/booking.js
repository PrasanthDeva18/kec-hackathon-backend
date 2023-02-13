const mongoose = require("mongoose")
const Schema = mongoose.Schema

const bookingSchema = new Schema({
  endAt: { type: Date, required: true },
  startAt: { type: Date, required: true },
  clubname: { type: String },
  eventname:{type:String, required:true},
  attendees: { type: String },
  email: { type: String },
  createdAt: { type: Date, default: Date.now },
  hallname: { type: String,required:true },
  phonenumber:{type:String},
  status: {
    type: String,
    default: 'pending'
  }
})

const booking = mongoose.model("booking", bookingSchema)

module.exports = booking
