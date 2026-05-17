
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Maheshisagood$boy'


// ROUTE 1: create a user using: POST "/api/auth/createuser". no login required
router.post('/createuser', [
    body('name').isLength({min: 3}),
    body('email').isEmail(),
    body('password').isLength({min: 5}),
], async (req, res)=>{
     let success = false;
    // if there are errors return bad requests and errors 
      const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success, errors: errors.array() });
        }
        try{
        // check wheather the user with this email exists already
        let user = await User.findOne({email: req.body.email})
        if(user){
            return res.status(400).json({success, error: "sorry the user with this email already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        secPass = await bcrypt.hash(req.body.password, salt)
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        console.log(authToken);
        success = true;
        res.json({success, authToken})


    }catch(error){
        console.error(error.mrssage);
        res.status(500).send("Internal server error");
    }
    
   
})

// ROUTE 2: Authenticate a user using: POST "/api/auth/login". no login required
router.post('/login', [
    body('email', 'Enter a valid name').isEmail(),
    body('password', 'password cannot be blank').exists(),
], async (req, res)=>{
     const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array() });
        }

        let success = false;

        const {email, password} = req.body;
        try{
            let user = await User.findOne({email});
            if(!user){
                success = false;
                return res.status(400).json({success, error: "please try to login with correct credentials"});
            }

            const passwordCompare = await bcrypt.compare(password, user.password)
            if(!passwordCompare){
                success = false;
                return res.status(400).json({success, error: "please try to login with correct credentials"});
            }

            const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authToken})
        }catch(error){
            console.error(error.mrssage);
            res.status(500).send("Internal server error");
        }
})

//ROUTE 3: Get logeedin user details using: POST "/api/auth/getuser". no login required
router.post('/getuser', fetchuser, async (req, res)=>{
try{
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
}catch(error){
    console.error(error.mrssage);
    res.status(500).send("Internal server error");
}
})

module.exports = router