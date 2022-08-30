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




// likeSchema = new mongoose.Schema({
//     userId : {
//         type: mongoose.Types.ObjectId,
//         required: true
//     } ,
//     postId : {
//         type: mongoose.Types.ObjectId,
//         required: true }, 
//     date: {type : Date , default: Date.now}
// })

// const Like = mongoose.model('Like' , likeSchema);


router.get('/' , auth , async(req , res) => {
    const likes = await Like
    .find();
    res.send(likes);
});


router.get('/:id' , auth , async (req , res) => {
    const like = await Like
        .findById(req.params.id);
    
    if (!like) // 404
        return res.status(404).send('The like with the given ID was not found.');
    res.send(like);
    console.log(like);
});


// post command
router.post('/' , auth , async (req, res) => {
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


