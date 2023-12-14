const mongoose =require('mongoose');
const url=`${process.env.MONGODBURL}freelancer`


const connect=mongoose.connect(url)

connect.then((db)=>{
    console.log('mongoose is connected to the database securely');
},(err)=>{
    console.log('we get error while we connect with the database',err);
})