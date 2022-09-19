const auth = require('../middleware/auth');
const selfOrAdmin = require('../middleware/selfOrAdmin');
const express = require('express');
const {User} = require('../modules/user');
const {Post} = require('../modules/post');
const _ = require('lodash')
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


router.post('/' , auth , async (req, res) => {
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


router.put('/:id' , auth , async (req , res) => {
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
        let post = await Post
            .findByIdAndUpdate(req.params.id , _.pick(req.body , ['title' , 'text']));
        if (!post) // 404                                                                               
            return res.status(404).send('The post with the given ID was not found.');
        if(req.user._id != post.writerId && !req.user.isAdmin)
            return res.status(403).send('Access denied.');
        post = await Post.findById(req.params.id);
        res.send(post);
    }
    catch(ex){
        console.log(ex.message);
        res.send(ex.message);
    }    
});


router.delete('/:id' , auth , async (req, res) => {
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
        const post = await Post.findById(req.params.id);
        if(!post)
            return res.status(404).send("Invalid post Id");
        if(req.user._id != post.writerId && !req.user.isAdmin)
            return res.status(403).send('Access denied.');
        await Post.remove({_id: req.params.id});
        const user = await User.findById(req.user._id);
        const postIndex = user.posts.indexOf(post._id);
        if(postIndex != 1)
            user.posts.splice(postIndex , 1);
        await user.save();

        res.send("Post deleted successfully.\n\n" + post);
    }
    catch(ex){
        console.log(ex.message);
        res.send(ex.message);
    }
}); 




module.exports = router;
module.exports.Post = Post;