const express = require('express');
// const Joi = require('joi');
const router = express.Router();


let likes = [
    {
        id : 1 , userId : 1 , postId : 1
    } , 
    {
        id : 2 , userId : 1 , postId : 2        
    } ,
    {
        id : 3 , userId : 2 , postId : 3
    }
];

router.get('/' , (req , res) => {
    res.send(likes);
});


router.get('/:id' , (req , res) => {
    const like = likes.find(c => c.id === parseInt(req.params.id));
    if (!like) // 404
        return res.status(404).send('The like with the given ID was not found.');
    res.send(like);
    console.log(like);
});


// post command
router.post('/' , (req, res) => {
    if(validateLike(req.body).error){ //400
        return res.status(400).send(validateLike(req.body).error.details[0].message);
    }
    let like = {
        id: likes.length + 1,
        userId : req.body.userId ,
        postId : req.body.postId
    };
    likes.push(like);
    res.send(like);
});


// put command
router.put('/:id' , (req , res) => {
    let like = likes.find(c => c.id === parseInt(req.params.id));
    if (!like) // 404
        return res.status(404).send('The like with the given ID was not found.');
    const validation = validateLike(req.body);
    if (validation.error) // 400
        return res.status(400).send(validation.error.details[0].message);
    like.userId = req.body.userId;
    like.postId = req.body.postId;
    
    res.send(like);
});

// delete command
router.delete('/:id' , (req, res) => {
    const like = likes.find(c => c.id === parseInt(req.params.id));
    if (!like) {// 404
        return res.status(404).send('The like with the given ID was not found.');
    }
    const index = likes.indexOf(like);
    likes.splice(index, 1);
    delete like;
    res.send("like deleted successfully. \n" + likes);
});


function validateLike(like) {
    const schema = Joi.object({
        userId : Joi.number().required().min(1) ,
        postId : Joi.number().required().min(1)
    });
    return schema.validate(post);
};

module.exports = router;


