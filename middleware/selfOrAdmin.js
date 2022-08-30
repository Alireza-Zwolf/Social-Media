const jwt = require('jsonwebtoken');
const config = require('config'); 


module.exports = function (req, res, next) {
    try{
        const token = req.header('x-auth-token');
        console.log(req.user._id);
        console.log(req.body.writerId);
        if( req.user._id != req.body.writerId)
            return res.status(403).send('Access denied.');
        next();
    }
    catch(ex){
        res.status(400).send(ex.message);
    }
}


