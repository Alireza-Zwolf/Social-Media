const {User} = require('../modules/user');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');



router.delete("/" , auth , async (req , res) => {
    try{
        User.deleteMany({});
        console.log("All likes deleted");
    }
    catch(ex){
        console.log(ex);
    }
});


module.exports = router;