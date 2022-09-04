const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const selfOrAdmin = require('../middleware/selfOrAdmin');
// const Joi = require('joi');
const router = express.Router();
const {User} = require('../modules/user');
const {Post} = require('../modules/post');
const {Like} = require('../modules/like');
const _ = require('lodash')




router.get('/' , auth , async(req , res) => {
    /*
    #swagger.tags = ['Likes']
    #swagger.path = '/api/likes'
    #swagger.description = 'get all likes'
    #swagger.responses[200] = {
        description: 'array of likes returned'
    }
    #swagger.responses[400] = {
        description: 'internal server error'
    }
    */
    const likes = await Like
    .find();
    res.send(likes);
});


router.get('/:id' , auth , async (req , res) => {
    /*
    #swagger.tags = ['Likes']
    #swagger.path = '/api/likes/{id}'
    #swagger.description = 'get an specific like by id'
    #swagger.parameters['id']
    #swagger.responses[200] = {
        description: 'specific like returned'
    }
    #swagger.responses[404] = {
        description: 'like not found'
    }
    #swagger.responses[500] = {
        description: 'internal server error'
    }
    */
    const like = await Like
        .findById(req.params.id);
    
    if (!like) // 404
        return res.status(404).send('The like with the given ID was not found.');
    res.send(like);
    console.log(like);
});


// post command
router.post('/' , auth , async (req, res) => {
    /*
    #swagger.tags = ['Likes']
    #swagger.path = '/api/likes'
    #swagger.description = 'Create new like'
    #swagger.responses[200] = {
        description: 'like created successfully'
    }
    #swagger.responses[500] = {
        description: 'internal server error'
    }
    #swagger.parameters['UserId'] = {
        'in' : 'body',
        'description' : 'The id of the liker',
        'required' : true,
        'type' : 'string'
    }
    #swagger.parameters['postId'] = {
        'in' : 'body',
        'description' : 'The id of the liked post',
        'required' : true,
        'type' : 'string'
    }
    #swagger.parameters['date'] = {
        'description' : 'The time of creating the like',
        'required' : false,
    }
    */
    try{
        const user = await User.findById(req.body.userId);
        if(!user)
            return res.status(404).send('The user with the given ID was not found.');
        const post = await Post.findById(req.body.postId);
        if(!post)
            return res.status(404).send("The post with the given ID was not found.");
        
        const like = await new Like({
            userId : req.body.userId,
            postId : req.body.postId
        })
        await like.save();
        post.likes.push(like);
        await post.save();

        // res.send(_.pick(like , ['user' , 'post']));
        res.send(like); 
    }
    catch(ex){
        console.log(ex.message);
        res.send(ex.message);
    }
});



// delete command
router.delete('/:id' , auth , async (req, res) => {
    /*
        #swagger.tags = ['Likes']
        #swagger.path = '/api/likes/{id}'
        #swagger.description = 'Delete specific post'
        swagger.parameters['id']
        #swagger.responses[200] = {
            description: 'like deleted successfully'
        }
        #swagger.responses[404] = {
            description: 'like not found'
        }
        #swagger.responses[500] = {
            description: 'internal server error'
        }
    */
    try{
        const like = Like.findbyIdAndRemove(req.params.id);
        if(!like)
            return res.status(404).send('The like with the given ID was not found.');
        const post = await Post.findById(like.postId);
        const index = post.likes.indexOf(like._id);
        if(index != -1)
            post.likes.splice(index , 1);
        await post.save();
        res.send(like); 
    }
    catch(ex){
        console.log(ex.message);
    }
});

router.delete('/DeleteAll' , auth , async (req , res) => {
    try{
        Like.deleteMany({});
        console.log("All likes deleted");
    }
    catch(ex){
        console.log(ex.message);
    }
});




module.exports = router;


