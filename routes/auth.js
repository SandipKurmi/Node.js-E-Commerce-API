const router = require('express').Router();
const User = require('../models/User')
const Cryptojs = require('crypto-js')
const jwt = require ('jsonwebtoken')

//register
router.post('/register', async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: Cryptojs.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
    })
    try {
        const savedUser = await newUser.save()
        res.status(200).json(savedUser)

    } catch (error) {
        res.status(500).json(error)
    }

})

//login

router.post('/login', async (req,res) => {
    try {
        const user = await User.findOne({username : req.body.username})
        !user && res.status(401).json('worng username')
        const accessToken = jwt.sign ({
            id: user._id,
            isAdmin: user.isAdmin 
        }, process.env.JWT_SEC,{expiresIn:"3d"})


        const hashedPassword = Cryptojs.AES.decrypt(user.password, process.env.PASS_SEC)
        const Originalpassword = hashedPassword.toString(Cryptojs.enc.Utf8);

        Originalpassword !== req.body.password && res.status(401).json('worng password')

        const {password, ...others} = user._doc;
        res.status(200).json({...others, accessToken})
    } catch (error) {
        res.status(500).json(error)
        
    } 
})


module.exports = router