const mongoose = require('mongoose');
const config = require('config');
const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const users = require('./routes/users');
const posts = require('./routes/posts');
const likes = require('./routes/likes');
const auth = require('./routes/auth');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')




app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))






if(!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

// console.log(config.get('jwtPrivateKey'));

mongoose.connect('mongodb://localhost/social-media')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));
 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use('/api/users' , users);
app.use('/api/posts' , posts);
app.use('/api/likes' , likes);
app.use('/api/auth' , auth);



app.get('/' , (req , res) => {
    res.send('Welcome to our social media!');
});




const port = process.env.PORT || 3000;
app.listen(port , () => console.log(`listening  on port ${port}...`));

