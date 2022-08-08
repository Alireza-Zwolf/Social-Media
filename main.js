const express = require('express');
const app = express();
const helmet = require('helmet');
const Joi = require('joi');
const morgan = require('morgan');
const users = require('./routes/users');
const posts = require('./routes/posts');
const likes = require('./routes/likes');
//const home = require('./');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use('/api/users' , users);
app.use('/api/posts' , posts);
app.use('/api/likes' , likes);
//app.use('/' , home);



app.get('/' , (req , res) => {
    res.send('Welcome to our social media!');
});




const port = process.env.PORT || 3000;
app.listen(port , () => console.log(`listening  on port ${port}...`));