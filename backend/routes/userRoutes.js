const express=require('express');
const protect=require('../middleware/authentication')
const {registerUser,loginUser}=require('../controllers/userController');

const router=express.Router()

router.post('/register',registerUser)
router.post('/login',loginUser);


module.exports=router;