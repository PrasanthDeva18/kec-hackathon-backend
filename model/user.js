const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    fullname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default: 'user'
    }
})
userSchema.pre('save', async function (next){
    if(!this.isModified('password')){
        next();
    }
    this.password  = await bcrypt.hash(this.password, 10)
})
userSchema.pre('save', async function (next){
    if(!this.isModified('confirmpassword')){
        next();
    }
    this.confirmpassword  = await bcrypt.hash(this.confirmpassword, 10)
})
const users = mongoose.model('user',userSchema);
module.exports=users;