const auth = require('../middleware/auth');
const selfOrAdmin = require('../middleware/selfOrAdmin');
const express = require('express');
const mongoose = require('mongoose');
const {User} = require('../modules/user');
const {Post} = require('../modules/post');


// const Joi = require('joi');
const router = express.Router();

// postSchema = new mongoose.Schema({
//     writerId : {
//         type: mongoose.Types.ObjectId,
//         required: true
//     } ,
//     likes : [mongoose.Types.ObjectId], 
//     title: {
//         type: String,
//         required: true
//     },
//     text: String ,
//     date: {type : Date , default: Date.now}
// })

// const Post = mongoose.model('Post', postSchema);



router.get('/' , async(req , res) => {
    const posts = await Post
    .find();
    res.send(posts);
});


router.get('/:id' , async (req , res) => {
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