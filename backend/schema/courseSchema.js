const mongoose=require('mongoose');
const Schema=mongoose.Schema

const courseSchema=new Schema({
    courseName:{
        type:String,
        required:true
    },
    courseDescription:{
        type:String,
    },
    purchaseBy:[]
})

module.exports=mongoose.model('courses',courseSchema);