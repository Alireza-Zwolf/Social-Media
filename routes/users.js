const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const selfOrAdmin = require('../middleware/selfOrAdmin');
const jwt = require('jsonwebtoken');
const config = require('config'); 
const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash')
const bcrypt = require('bcrypt');
const {User} = require('../modules/user');
// const Joi = require('joi');
const router = express.Router();

// userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     } ,
//     username:  {
//         type: String,
//         required: true,
//         unique: true
//     } ,
//     email: {
//         type: String,
//         required: true,
//         unique: true ,
//         minlength: 5
//     } ,
//     age:  {
//         type: Number,
//         required: true ,
//         min: 18,                                                //check
//         max: 100                                                //check                         
//     } ,
//     password: {
//         type: String,
//         required: true,
//         minlength: 5,
//         maxlength: 1024,
//     } ,
//     posts : [mongoose.Types.ObjectId] ,
//     likes : [mongoose.Types.ObjectId] , 
//     date : {type : Date , default: Date.now} ,
//     isAdmin : Boolean
// })

// userSchema.methods.generateAuthToken = function(){
//     const token = jwt.sign({ _id: this._id , isAdmin: this.isAdmin} , config.get('jwtPrivateKey'));
//     return token;
// }

// const User = mongoose.model('User', userSchema);


// get commands
router.get('/' , async(req , res) => {
    const users = await User
    .find();
    res.send(users);
});

router.get('/:id' , auth ,async (req , res) => {
    const id = req.params.id;
    const user = await User
    .findById(id).select('password');
    
    if (!user) // 404
        return res.status(404).send('The user with the given ID was not found.');
    res.send(user);
    console.log(user);
});

// router.get('/me' , async (req , res) => {
//     //const user = await User.findById(req.user._id).select('-password');
//     //res.send(user);
//     res.send("Hi");
// });

// post command
router.post('/' , async (req, res) => {
    try{
        let user = await User.findOne({email : req.body.email});
        if(user) return res.status(400).send('User already exists.');
        user = await new User({
            name: req.body.name,
            username: req.body.username,
            age: req.body.age,
            password: req.body.password,
            email: req.body.email,
            isAdmin : req.body.isAdmin,
            posts: [],
            likes: [],
        })
        // const user = new User(_.pick(req.body , ['name' , 'username' , 'email' , 'age' , 'password']));

        // save data
        let result = await user.save();
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        result = await user.save();

        // make token
        const token = user.generateAuthToken();
        res.header('x-auth-token' , token).send(_.pick(user, ['id' , 'name' , 'email']))
    }
    catch(ex){
        console.log(ex.message);
        res.send(ex.message);
    }    
});


// put command
router.put('/:id' , [auth , selfOrAdmin] , async (req , res) => {
    try{
        const user = await User
            .findByIdAndUpdate(req.params.id , _pick(req.body , ['name' , 'username' ,'email' , 'phone' , 'password' , 'isAdmin']));
        if (!user) // 404
            return res.status(404).send('The user with the given ID was not found.');
            
        res.send(user);
    }
    catch(ex){
        console.log(ex.message);
        res.send(ex.message);
    }    
});

// delete command
router.delete('/:id' , [auth , selfOrAdmin] , (req, res) => {
    const userId = req.params.id;
    try{
        const result = User.findbyIdAndRemove(userId);
        console.log(result);
    }
    catch(ex){
        console.log(ex.message);
    }
});


router.delete('/DeleteAll' , auth , async (req , res) => {
    try{
        User.deleteMany();
        console.log("All likes deleted");
    }
    catch(ex){
        console.log(ex.message);
    }
});




module.exports = router;
module.exports.User = User;

