import express from 'express';
import { getUserData, purchaseCourse, userEndrolledCourse } from '../controllers/userController.js';


const userRouter = express.Router();


userRouter.get('/data', getUserData);
userRouter.get('/endrolled-course', userEndrolledCourse);
userRouter.post('/purchase', purchaseCourse);


export default userRouter;