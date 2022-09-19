const auth = require('../middleware/auth');
const selfOrAdmin = require('../middleware/selfOrAdmin');
const express = require('express');
const _ = require('lodash')
const bcrypt = require('bcrypt');
const {User} = require('../modules/user');
const router = express.Router();


// get commands
router.get('/' , async(req , res) => {
    /*
    #swagger.tags = ['Users']
    #swagger.path = '/api/users'
    #swagger.description = 'get all users'
    #swagger.responses[200] = {
        description: 'array of users returned'
    }
    #swagger.responses[500] = {
        description: 'internal server error'
    }
    */

    
    const users = await User
    .find();
    res.send(users);
});

router.get('/:id' , auth ,async (req , res) => {
    /*
    #swagger.tags = ['Users']
    #swagger.path = '/api/users/{id}'
    #swagger.description = 'get an specific user by id'
    #swagger.parameters['id']
    #swagger.responses[200] = {
        description: 'specific user returned'
        schema: { $ref: "#/definitions/User" }
    }
    #swagger.responses[404] = {
        description: 'user not found'
    }
    #swagger.responses[500] = {
        description: 'internal server error'
    }
    */
    const id = req.params.id;
    const user = await User
    .findById(id).select('password');
    
    if (!user) // 404
        return res.status(404).send('The user with the given ID was not found.');
    res.send(user);
    console.log(user);
});

// post command
router.post('/' , async (req, res) => {
    /*
        #swagger.tags = ['Users']
        #swagger.path = '/api/users'
        #swagger.description = 'Create new user'
        #swagger.responses[200] = {
            description: 'user created successfully'
        }
        #swagger.responses[500] = {
            description: 'internal server error'
        }
        swagger.parameters['name'] = {
            'in': 'body',
            'description': 'name of the user',
            'required': true,
            'type': 'string'
        }
        swagger.parameters['email'] = {
            'in': 'body',
            'description': 'email of the user',
            'required': true,
            'type': 'string'
        }
        swagger.parameters['password'] = {
            'in': 'body',
            'description': 'password of the user',
            'required': true,
            'type': 'string'
        }
        swagger.parameters['isAdmin'] = {
            'in': 'body',
            'description': 'isAdmin of the user',
            'required': true,
            'type': 'boolean'
        }
        swagger.parameters['age'] = {
            'in': 'body',
            'description': 'age of the user',
            'required': true,
            'type': 'number'
        }
    */
    try{
        let user = await User.findOne({email : req.body.email});
        if(user) return res.status(400).send('User already exists. Try another email.');
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
        console.log(user.password);
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
    /*
        #swagger.tags = ['Users']
        #swagger.path = '/api/users/{id}'
        #swagger.description = 'Update specific user'
        #swagger.responses[200] = {
            description: 'user is updated successfully'
        }
        #swagger.responses[404] = {
            description: 'user not found'
        }
        #swagger.responses[500] = {
            description: 'internal server error'
        }
        swagger.parameters['name'] = {
            'in': 'body',
            'description': 'name of the user',
            'required': true,
            'type': 'string'
        }
        swagger.parameters['email'] = {
            'in': 'body',
            'description': 'email of the user',
            'required': true,
            'type': 'string'
        }
        swagger.parameters['password'] = {
            'in': 'body',
            'description': 'password of the user',
            'required': true,
            'type': 'string'
        }
        swagger.parameters['isAdmin'] = {
            'in': 'body',
            'description': 'isAdmin of the user',
            'required': true,
            'type': 'boolean'
        }
        swagger.parameters['age'] = {
            'in': 'body',
            'description': 'age of the user',
            'required': true,
            'type': 'number'
        }
    */
    try{
        console.log(req.params.id);
        let user = await User
            .findByIdAndUpdate(req.params.id , _.pick(req.body , ['name' , 'username' ,'email' , 'phone' , 'password' , 'isAdmin']));
        if (!user) // 404
            return res.status(404).send('The user with the given ID was not found.');
        user = await User.findById(req.params.id);
        res.send(user);
    }
    catch(ex){
        console.log(ex.message);
        res.send(ex.message);
    }    
});

// delete command
router.delete('/:id' , [auth , selfOrAdmin] , async (req, res) => {
    /*
        #swagger.tags = ['Users']
        #swagger.path = 'api/users/{id}'
        #swagger.description = 'Delete specific user'
        #swagger.responses[200] = {
            description: 'user is deleted successfully'
        }
        #swagger.responses[404] = {
            description: 'user not found'
        }
        #swagger.responses[500] = {
            description: 'internal server error'
        }
        swagger.parameters['id']
    */
    const userId = req.params.id;
    try{
        const user = await User.findById(req.params.id);
        if(!user)
            return res.status(404).send("Invalid user Id");
        await User.deleteOne({_id : userId});
        res.send("User Deleted successfully\n\n" + user);
    }
    catch(ex){
        res.send(ex.message)
    }
});



module.exports = router;
module.exports.User = User;

