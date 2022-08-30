const mongoose = require('mongoose');



postSchema = new mongoose.Schema({
    writerId : {
        type: mongoose.Types.ObjectId,
        required: true
    } ,
    likes : [mongoose.Types.ObjectId], 
    title: {
        type: String,
        required: true
    },
    text: String ,
    date: {type : Date , default: Date.now}
})

const Post = mongoose.model('Post', postSchema);

module.exports.Post = Post;
