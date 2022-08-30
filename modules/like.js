const mongoose = require('mongoose');


likeSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Types.ObjectId,
        required: true
    } ,
    postId : {
        type: mongoose.Types.ObjectId,
        required: true }, 
    date: {type : Date , default: Date.now}
})

const Like = mongoose.model('Like' , likeSchema);

module.exports.Like = Like;
