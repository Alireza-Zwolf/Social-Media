const express = require('express');
// const Joi = require('joi');
const router = express.Router();


let users = [
    {
        id : 1 , name : "Alireza" , username : "Alireza2621", age : 20
    } , 
    {
        id : 2 , name : "Mehrnoosh" , username : "Mehr123", age : 13
    } ,
    {
        id : 3 , name : "Iraj" , username : "IrajKing", age : 32
    }
];

// get commands
router.get('/' , (req , res) => {
    res.send(users);
});

router.get('/:id' , (req , res) => {
    const user = users.find(c => c.id === parseInt(req.params.id));
    if (!user) // 404
        return res.status(404).send('The user with the given ID was not found.');
    res.send(user);
    console.log(user);
});


// post command
router.post('/' , (req, res) => {
    if(validateUser(req.body).error){ //400
        return res.status(400).send(validateUser(req.body).error.details[0].message);
    }
    let user = {
        id: users.length + 1,
        name: req.body.name ,
        username: req.body.username ,
        age: req.body.age
    };
    users.push(user);
    res.send(user);
});


// put command
router.put('/:id' , (req , res) => {
    let user = users.find(c => c.id === parseInt(req.params.id));
    if (!user) // 404
        return res.status(404).send('The user with the given ID was not found.');
    const validation = validateUser(req.body);
    if (validation.error) // 400
        return res.status(400).send(validation.error.details[0].message);
    user.name = req.body.name;
    user.username = req.body.username;
    user.age = req.body.age;
    res.send(user);
});

// delete command
router.delete('/:id' , (req, res) => {
    const user = users.find(c => c.id === parseInt(req.params.id));
    if (!user) {// 404
        return res.status(404).send('The user with the given ID was not found.');
    }
    const index = users.indexOf(user);
    users.splice(index, 1);
    delete user;
    res.send(users);
});


function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).required() ,
        username: Joi.string().min(3).required() ,
        age: Joi.number().min(18).required()
    });
    return schema.validate(user);
};



module.exports = router;