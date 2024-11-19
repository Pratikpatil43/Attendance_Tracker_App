const express = require('express');
const router = express.Router();

router.post('/login',(req,res)=>{
    res.send("Hi this Auth route is working properly")
});

module.exports = router;
