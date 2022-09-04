const auth = require('../middleware/auth');
const selfOrAdmin = require('../middleware/selfOrAdmin');
const express = require('express');
// const mongoose = require('mongoose');
const {User} = require('../modules/user');
const {Post} = require('../modules/post');


// const Joi = require('joi');
const router = express.Router();




router.get('/' , async(req , res) => {
    /*
    #swagger.tags = ['Posts']
    #swagger.path = '/api/posts'
    #swagger.description = 'get all posts'
    #swagger.responses[200] = {
        description: 'array of posts returned'
    }
    #swagger.responses[400] = {
        description: 'internal server error'
    }
    */

    const posts = await Post
    .find();
    res.send(posts);
});


router.get('/:id' , async (req , res) => {
    /*
    #swagger.tags = ['Posts']
    #swagger.path = '/api/posts/{id}'
    #swagger.description = 'get an specific post by id'
    #swagger.parameters['id']
    #swagger.responses[200] = {
        description: 'specific post returned'
    }
    #swagger.responses[404] = {
        description: 'post not found'
    }
    #swagger.responses[500] = {
        description: 'internal server error'
    }
    */
    const post = await Post
    .findById(req.params.id)
    .populate('writerId' , 'name email age')
    
    if (!post) // 404
        return res.status(404).send('The post with the given ID was not found.');
    res.send(post);
    console.log(post);
});



// post command
router.post('/' , [auth , selfOrAdmin] , async (req, res) => {
    /*
    #swagger.tags = ['Posts']
    #swagger.path = '/api/posts'
    #swagger.description = 'Create new post'
    #swagger.responses[200] = {
        description: 'post created successfully'
    }
    #swagger.responses[500] = {
        description: 'internal server error'
    }
    #swagger.parameters['writerId'] = {
        'in' : 'body',
        'description' : 'The id of the writer',
        'required' : true,
        'type' : 'string'
    }
    #swagger.parameters['title'] = {
        'in' : 'body',
        'description' : 'The title of the post',
        'required' : true,
        'type' : 'string'
    }
    #swagger.parameters['text'] = {
        'in' : 'body',
        'description' : 'The text of the post',
        'required' : false,
        'type' : 'string'
    }       
    #swagger.parameters['date'] = {
        'description' : 'The time of creating the post',
        'required' : false,
    }
    */
    try{
        const post = await new Post({
            writerId: req.user._id ,
            title: req.body.title ,
            text: req.body.text 
        })
        const result = await post.save();
        console.log(result);
        res.send(post);
    }
    catch(ex){
        console.log(ex.message);
        res.send(ex.message);
    }    
});


// put command
router.put('/:id' , [auth , selfOrAdmin] , async (req , res) => {
    /*
        #swagger.tags = ['Posts']
        #swagger.path = '/api/posts/{id}'
        #swagger.description = 'Update specific post'
        #swagger.responses[200] = {
            description: 'post is updated successfully'
        }
        #swagger.responses[404] = {
            description: 'post not found'
        }
        #swagger.responses[500] = {
            description: 'internal server error'
        }
        #swagger.parameters['writerId'] = {
        'in' : 'body',
        'description' : 'The id of the writer',
        'required' : true,
        'type' : 'string'
    }
    #swagger.parameters['title'] = {
        'in' : 'body',
        'description' : 'The title of the post',
        'required' : true,
        'type' : 'string'
    }
    #swagger.parameters['text'] = {
        'in' : 'body',
        'description' : 'The text of the post',
        'required' : false,
        'type' : 'string'
    }       
    #swagger.parameters['date'] = {
        'description' : 'The time of creating the post',
        'required' : false,
    }
    */
    try{
        const post = await Post
            .findByIdAndUpdate(req.params.id , _.pick(req.body , ['title' , 'text']));
        if (!post) // 404                                                                               // next step: implement it with try catch
            return res.status(404).send('The post with the given ID was not found.');
            const result = await post.save();
            console.log(result);
            res.send(post);
    }
    catch(ex){
        console.log(ex.message);
        res.send(ex.message);
    }    
});


// delete command
router.delete('/:id' , [auth , selfOrAdmin] , async (req, res) => {
    /*
        #swagger.tags = ['Posts']
        #swagger.path = '/api/posts/{id}'
        #swagger.description = 'Delete specific post'
        swagger.parameters['id']
        #swagger.responses[200] = {
            description: 'post deleted successfully'
        }
        #swagger.responses[404] = {
            description: 'post not found'
        }
        #swagger.responses[500] = {
            description: 'internal server error'
        }
    */
    try{
        const post = await Post.findbyIdAndRemove(req.params.id);
        if(!post)
            return res.status(404).send("Invalid post Id");
        const user = await User.findById(req.user._id);
        const postIndex = user.posts.indexof(post._id);
        if(index != 1)
            user.posts.splice(index , 1);
        await user.save();

        res.send("Deleted Post was: \n" + post);
    }
    catch(ex){
        console.log(ex.message);
    }
}); 


router.delete('/DeleteAll' , auth , async (req , res) => {
    try{
        Post.deleteMany();
        console.log("All likes deleted");
    }
    catch(ex){
        console.log(ex.message);
    }
});


// async function validateData(writerId , validateType) {
//     const user = await validateType
//     .findById(writerId);

//     if(!user)
//         return false;
//     return true;
// };

module.exports = router;
module.exports.Post = Post;