const express=require('express');
const protect=require('../middleware/authentication')
const {registerUser,loginUser, courseToPurchase, coursePurchaseByUser}=require('../controllers/userController');

const router=express.Router()

router.post('/register',registerUser)
router.post('/login',loginUser);
router.put('/:courseId',protect,courseToPurchase);
router.get('/course',protect,coursePurchaseByUser);


module.exports=router;