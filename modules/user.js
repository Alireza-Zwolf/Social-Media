const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config'); 


userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    } ,
    username:  {
        type: String,
        required: true,
        unique: true
    } ,
    email: {
        type: String,
        required: true,
        unique: true ,
        minlength: 5
    } ,
    age:  {
        type: Number,
        required: true ,
        min: 18,                                                //check
        max: 100                                                //check                         
    } ,
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    } ,
    posts : [mongoose.Types.ObjectId] ,
    likes : [mongoose.Types.ObjectId] , 
    date : {type : Date , default: Date.now} ,
    isAdmin : Boolean
})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id: this._id , isAdmin: this.isAdmin} , config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);


module.exports.User = User;
