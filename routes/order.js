const router = require('express').Router();
const Order = require("../models/Order");
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken');


//creat 
router.post('/',verifyToken,  async (req, res) => {
    const newOrder = new Order(req.body)

    try {
        const savedOrder = await  newOrder.save();
        res.status(200).json(savedOrder)
    } catch (error) {
        res.status(500).json(error)
    }
})


//update  

router.put('/:id', verifyTokenAndAdmin , async(req, res) => {
    
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        },
        {new:true}
        )

        res.status(200).json(updatedOrder)
        
    } catch (error) {
        res.status(500).json(error)
        console.log(error)
    }
    
})

//delete 
router.delete('/:id' ,verifyTokenAndAdmin , async(req, res) => {
    try {
        await Order.findByIdAndDelete(req.body.id)
        res.status(200).json('Order has been deleted')
    } catch (error) {
        res.status(500).json(error)
        
    }
})

//get user Order

router.get('/find/:userId' ,verifyTokenAndAuthorization, async(req, res) => {
    try {
        const Order = await Order.find({userId : req.params.userId});
        res.status(200).json(Order)
     
    } catch (error) {
        res.status(500).json(error)
        
    }
})

//get all
router.get("/", verifyTokenAndAdmin , async (req,res)=> {
    try {
        const orders = await Order.find()
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json(error)
        
    }
})


module.exports = router