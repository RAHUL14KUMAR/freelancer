const expressAsyncHandler=require('express-async-handler');
const course=require('../schema/courseSchema');

// get all courses details
const getAllCourses=expressAsyncHandler(async(req,res)=>{
    try{
        const courses=await course.find({}).select('-purchaseBy');
        res.status(200).json(courses);
    }catch(error){
        console.log(error);
        res.status(500).json("error is occured in getAllCourses routes");
    }
})

// add the courses
const addCourse=expressAsyncHandler(async(req,res)=>{
    const {name,description}=req.body
    try{
        const {role}=req.user;
        if(role==='ADMIN'){
            const courses=await course.create({
                courseName:name,
                courseDescription:description
            })
            res.status(200).json({
                name:courses.courseName,
                description:courses.courseDescription,
                enroll:courses.purchaseBy.length
            })
        }else{
            res.status(404).json("you are not the correct user for adding courses");
        }
    }catch(error){
        console.log(error);
        res.status(500).json("error is occured in the addCouse route");
    }
})


// update the courses by id
const updateCourse=expressAsyncHandler(async(req,res)=>{
    try{
        const id=req.params.courseId;
        const {role}=req.user;
        if(role==='ADMIN'){
            const courses=await course.findByIdAndUpdate(id,{$set:req.body},{new:true});
            await courses.save();

            res.status(200).json(courses);
        }
    }catch(error){
        console.log(error);
        res.status(500).json("error occured in updtaeCourse Route");
    }
})

module.exports={
    addCourse,
    updateCourse,
    getAllCourses
}