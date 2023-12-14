const express=require('express');
const protect=require('../middleware/authentication')
const { updateUser, getAllUser } = require('../controllers/adminController');
const { addCourse, getAllCourses, updateCourse } = require('../controllers/courseController');
const router=express.Router();

router.get('/users',getAllUser)
router.put('/:userId',protect,updateUser);
router.post('/course',protect,addCourse);
router.get('/course',getAllCourses);
router.put('/course/:courseId',protect,updateCourse);

module.exports=router;