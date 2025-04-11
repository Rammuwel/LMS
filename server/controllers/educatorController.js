import {clerkClient} from '@clerk/express'
import Course from '../models/Course.js'
import {v2 as cloudinary} from 'cloudinary'
import { Purchase } from '../models/Purchase.js';


// update role to educator
export const updateRoleToEducator = async (req, res)=>{
   try {
     
 
    const userId = req.auth.userId;

    await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata:{
            role: 'educator'
        }
    })
    res.json({success:true, message: 'You can publish a course now'})
   } catch (error) {
     res.json({success:false, message: error.message})
   }
}



// courses controller

// add new course
export const addCourse = async (req, res)=>{
  try {
    
    const {courseData} = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId;
    
    if(!imageFile){
      res.json({success:false, message: 'Thumbnail Not Attach'});
    }

   const parsedCourseData = await JSON.parse(courseData);
   parsedCourseData.educator = educatorId

   const newCourse = await Course.create(parsedCourseData);
   const imageUpload = await cloudinary.uploader.upload(imageFile.path);
   
   newCourse.courseThumbnail = imageUpload.secure_url;
   await newCourse.save();

   res.json({success:true, message: 'Course Added'});

  } catch (error) {
    res.json({success:false, message: error.message});
  }
}


//get educator courses
export const getEducationCourses = async (req, res)=>{
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({educator})
    res.json({success: true, courses})
  } catch (error) {
    res.json({success: false, message: error.message})
  }
}


//get Educator Dashboard Data (total earning, enrolled student, no of courses)

export const educatorDashboardData = async (req, res)=>{
   try {
     const educator = req.auth.userId;
     const courses = await Course.find({educator});
     const totalCourses = courses.length;

     const courseIds = courses.map(course=>course._id);

     //Calulate total earning from purchases
     const purchases = await Purchase.find({
      courseId: {$in: courseIds},
      status: 'completed'
     })

     const totalEarnings =purchases.reduce((sum, purchase)=>sum + purchase.amount, 0);

     //collect unique enrolled student ids with thier courses title
      
     const enrolledStudentsData = [];
     
     for(const course of courseData){
       const students = await User.find({
        _id:{$in: course.enrolledStudentsData}
       }, 'name imageUrl');

       students.forEach(student=>{
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student
        })
       })
     }

     res.json({success:true, dashboardData:{
      totalCourses,
      totalEarnings,
      enrolledStudentsData
     }});

   } catch (error) {
    res.json({success:false, message:error.message});
   }
}


// get endrolled student data with purchase data
export const getEnrolledStudentsData = async (req, res)=>{
  try {
     const educator = req.auth.userId;
     const courses = await Course.find({educator});
     const courseIds = courses.map(course=>course._id);

     const purchases =await Purchase.find({
      courseId:{$in: courseIds},
      status: 'completed'
     }).populate('userID', 'name imageUrl').populate('courseId', 'courseTitle')

     const endrolledStudents = purchases.map(purchase=>({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
     }))

    res.json({success: true, endrolledStudents})
  } catch (error) {
    res.json({success: false, message: error.message})
  }
}