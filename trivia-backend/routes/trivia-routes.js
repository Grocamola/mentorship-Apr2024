const express = require('express');
const router = express.Router();


router.get('/sign-in-request', (req, res, next) => { 
    console.log(req, res)
    res.json({message: 'sign in worked'});
});

router.get('/sign-up-request', (req, res, next) => { 
    console.log(req, res)
    res.json({message: 'sign up worked'});
});

router.get('/get-all-users', async(req, res, next) => { 
    console.log(req, res)
    res.json({message: 'getting all users worked'});
});


module.exports = router;