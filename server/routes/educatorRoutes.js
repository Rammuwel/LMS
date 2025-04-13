import express from 'express'
import { addCourse, educatorDashboardData, getEducationCourses, getEnrolledStudentsData, updateRoleToEducator } from '../controllers/educatorController.js'
import upload from '../config/multer.js'
import { ProtectEducator } from '../middlewares/authMiddleware.js'


const educatorRouter = express.Router()


//add Educator Role
educatorRouter.get('/update-role', updateRoleToEducator);
educatorRouter.post('/add-course', upload.single('image' ), ProtectEducator, addCourse);
educatorRouter.get('/courses', ProtectEducator, getEducationCourses);
educatorRouter.get('/dashboard', ProtectEducator, educatorDashboardData);
educatorRouter.get('/enrolled-students', ProtectEducator, getEnrolledStudentsData);

export default educatorRouter;


