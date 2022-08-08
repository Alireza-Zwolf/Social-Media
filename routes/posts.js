const express = require('express');
const router = express.Router();



let posts = [
    {
        id : 1 , title : "Hello World!" , text : ":)", userId : 1
    } , 
    {
        id : 2 , title : "fisrt commit" , text : ":))", UserId : 2
    } ,
    {
        id : 3 , title : "nice pic" , text : "-", userId : 3
    }
];


router.get('/' , (req , res) => {
    res.send(posts);
});

router.get('/:id' , (req , res) => {
    const post = posts.find(c => c.id === parseInt(req.params.id));
    if (!post) // 404
        return res.status(404).send('The post with the given ID was not found.');
    res.send(post);
    console.log(post);
});


// post command
router.post('/' , (req, res) => {
    if(validatePost(req.body).error){ //400
        return res.status(400).send(validatePost(req.body).error.details[0].message);
    }
    let post = {
        id: posts.length + 1,
        title: req.body.title ,
        text: req.body.text ,
        userId: req.body.userId
    };
    posts.push(post);
    res.send(post);
});


// put command
router.put('/:id' , (req , res) => {
    let post = posts.find(c => c.id === parseInt(req.params.id));
    if (!post) // 404
        return res.status(404).send('The post with the given ID was not found.');
    const validation = validatePost(req.body);
    if (validation.error) // 400
        return res.status(400).send(validation.error.details[0].message);
    post.title = req.body.title;
    post.text = req.body.text;
    post.userId = req.body.userId;
    
    res.send(user);
});

// delete command
router.delete('/:id' , (req, res) => {
    const post = posts.find(c => c.id === parseInt(req.params.id));
    if (!post) {// 404
        return res.status(404).send('The post with the given ID was not found.');
    }
    const index = posts.indexOf(post);
    posts.splice(index, 1);
    delete post;
    res.send("Post deleted successfully. \n" + posts);
});


function validatePost(post) {
    const schema = Joi.object({
        title: Joi.string().min(3).required() ,
        text: Joi.string().min(3).required() ,
        userId: Joi.number().min(1).required()
    });
    return schema.validate(post);
};

module.exports = router;
