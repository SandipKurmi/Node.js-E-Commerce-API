const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRoutes = require('./routes/user')
const auth = require('./routes/auth')
const productRoutes = require ('./routes/product')
const app = express()
const port = 3000
dotenv.config()

mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log('Db connection successfull'))
.catch((err)=>{ console.log(err);})
app.use(express.json());
app.use('/api/auth', auth);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);



app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))