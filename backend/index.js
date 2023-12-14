require('dotenv').config()
const express=require('express');
const connect=require('./connection/db');
const errorMiddleware=require('./middleware/error');
const cors=require('cors');
const userRoute=require('./routes/userRoutes')
const adminRoute=require('./routes/adminRoutes')

const app=express();
app.use(express.json());
app.use(cors());

const port=process.env.PORT;

app.get('/',(req,res)=>{
    res.status(200).json("backend system start working\n")
})

app.use('/user',userRoute);
app.use('/update',adminRoute);


app.use(errorMiddleware);
connect
app.listen(port,()=>
console.log(`server is running at http://localhost:${port}`)
)