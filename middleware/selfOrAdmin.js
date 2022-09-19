const jwt = require('jsonwebtoken');
const config = require('config'); 


module.exports = function (req, res, next) {
    try{
        const token = req.header('x-auth-token');
        if(req.user._id != req.params.id && !req.user.isAdmin)
            return res.status(403).send('Access denied.');
        next();
    }
    catch(ex){
        res.status(400).send(ex.message);
    }
}


