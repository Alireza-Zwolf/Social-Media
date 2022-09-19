const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../modules/user');
const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
const router = express.Router();



router.post('/' , async (req , res) => { 
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid email or password..');

    console.log(req.body.password);
    console.log(user.password);

    let validPassword = await bcrypt.compare(req.body.password , user.password)
    console.log(validPassword)
    if(!validPassword)
        return res.status(400).send('Invalid email or password.');
        
    const token = user.generateAuthToken();
    res.header('x-auth-token' , token).send('logged in successfully'); 
});


function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(req);
};


module.exports = router;