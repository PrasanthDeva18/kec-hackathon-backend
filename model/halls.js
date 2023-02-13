const mongoose = require("mongoose")

const Schema = mongoose.Schema

const hallSchema = new Schema({
    hallname: { type: String, required: true },
    image: { type: String },
    location:{type:String,required:true},
    capacity: { type: Number, required: true },
    projector: { type: Boolean, default: false },
    whiteboard: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    bookings: [
        {
            booking: { type: mongoose.Schema.Types.ObjectId, ref: "booking" },
            startAt: Date,
            endAt: Date,
            user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
            fullname:{
                type:String,
            }
        },
    ],
})

module.exports = mongoose.model("hall", hallSchema)
