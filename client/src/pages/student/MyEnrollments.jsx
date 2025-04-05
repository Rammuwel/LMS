import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import Footer from '../../components/student/Footer';
import { useNavigate } from 'react-router-dom';
import {Line} from 'rc-progress'


function MyEnrollments() {

  const navigate = useNavigate();
  const {enrolledCourses, calculateCourseDuration} = useContext(AppContext);
  const [progressArray, setProgressArray] = useState([
    {lectureCompleted: 2, totalLecture: 4},
    {lectureCompleted: 5, totalLecture: 5},
    {lectureCompleted: 5, totalLecture: 8},
    {lectureCompleted: 2, totalLecture: 4},
    {lectureCompleted: 2, totalLecture: 4},
    {lectureCompleted: 4, totalLecture: 4},
    {lectureCompleted: 2, totalLecture: 3},
    {lectureCompleted: 1, totalLecture: 4},
    {lectureCompleted: 2, totalLecture: 2},
    {lectureCompleted: 1, totalLecture: 4},
    {lectureCompleted: 2, totalLecture: 2},
    {lectureCompleted: 1, totalLecture: 3},
    {lectureCompleted: 2, totalLecture: 3},
    {lectureCompleted: 2, totalLecture: 4},
    
  ]);

  



  return (
    <>
    <div className='md:px-36 sm:px-8 px-4 pt-5 sm:pt-10'>
      <h2 className='text-2xl font-semibold'>MyEnrollments</h2>
       <table className='md:table-auto table-fixed w-full mt-2 sm:mt-10 overflow-hidden '>
         <thead className='text-gray-900 border-b border-gray-500/60 text-sm text-left max-sm:hidden'>
            <tr className=''>
            <th className='px-4 font-semibold thuncate'>Course</th>
             <th className='px-4 font-semibold thuncate'>Duration</th>
             <th className='px-4  font-semibold thuncate'>Completed</th>
             <th className='px-4 font-semibold thuncate'>Status</th>
            </tr>
         </thead>
         <tbody className='text-gray-700'>
             {enrolledCourses.map((course, i)=>(
              <tr key={i} className='border-b border-gray-500/20'>
                 <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3'>
                   <img src={course.courseThumbnail} alt="thumbnail" className='w-14 sm:w-24 md:w-28' />
                   <div className='flex-1'>
                      <p className='mb-1 max-sm:text-sm'>{course.courseTitle}</p>
                       <Line strokeWidth={2} percent={progressArray[i]?(progressArray[i].lectureCompleted*100)/progressArray[i].totalLecture:0} className='bg-gray-300 rounded-full' ></Line>
                   </div>
                 </td>
                 <td className='px-4 py-3  max-sm:hidden'>
                   {calculateCourseDuration(course)}
                 </td>
                 <td className='px-4 py-3 max-sm:hidden'>
                  {progressArray[i] && `${progressArray[i].lectureCompleted}/${progressArray[i].totalLecture}`} <span>Lectures</span>
                  </td>
                 <td className='px-2 py-1 md:px-3 md:py-2 max-sm:text-right'>
                   <button
                   onClick={()=>navigate('/player/' + course._id)}
                   className='px-3 sm:px-5 cursor-pointer py-1.5 sm:py-2 bg-blue-600 max-sm:text-xs text-white'
                   >
                    {progressArray[i].lectureCompleted/progressArray[i].totalLecture === 1? 'Completed':'On Going..'}
                  </button>
                  </td>
              </tr>
             ))}
         </tbody>
       </table>
    </div>
    <Footer/>
    </>
  )
}

export default MyEnrollments