const router = require('express').Router();
const User = require("../models/User");
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken');

router.put('/:id', verifyTokenAndAuthorization , async(req, res) => {
    if(req.body.password){
        req.body.password= Cryptojs.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
            ).toString()
    }
    
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        },
        {new:true}
        )

        res.status(200).json(updatedUser)
        
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
    
})

//delete
router.delete('/:id' ,verifyTokenAndAuthorization , async(req, res) => {
    try {
        await User.findByIdAndDelete(req.body.id)
        res.status(200).json('user has been deleted')
    } catch (error) {
        res.status(500).json(error)
        
    }
})

//get user

router.get('/find/:id' ,verifyTokenAndAdmin , async(req, res) => {
    try {
        const user = await User.findById(req.params .id);
        const {password, ...others} = user._doc;
        res.status(200).json(others)
     
    } catch (error) {
        res.status(500).json(error)
        
    }
})

//get all users
router.get('/' ,verifyTokenAndAdmin , async(req, res) => {
    const query = req.query.new
    try {
        const users = query ? await await User.find().sort({_id: -1}).limit(5) : await User.find();
        res.status(200).json(users)
     
    } catch (error) {
        res.status(500).json(error)
        
    }
})


//get user states
router.get('/states' , verifyTokenAndAdmin , async (req,res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1));
    try {
        const data = await User.aggregate([
            {$match: {createdAt: {$gte: lastYear}}},
            {
                $project:{
                    month: {$month: "$createdAt"},
                },
            },
            {
               $group:{
                   _id: "$month",
                   total:{$sum: 1},
               } 
            }
        ])

        res.status(200).json(data)

        
    } catch (error) {
        res.status(500).json(error)
        console.log(error);
        
    }

})


module.exports = router