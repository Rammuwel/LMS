import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import YouTube from 'react-youtube'
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import Footer from '../../components/student/Footer';
import { toast } from 'react-toastify';
import axios from 'axios';

function CourseDetails() {
  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);


  const { id } = useParams();

  const {getToken, currency, calculateRating, calculateChapterTime, calculateCourseDuration, calculateNoOfLecture, backendUrl, userData} = useContext(AppContext);

  const fechCourseData = async () => {
    
    try {
        const {data} = await axios.get(backendUrl+'/api/course/'+id)
      
       
        if(data.success){
          setCourseData(data.courseData)
        }else{
          toast.error(data.message)
        }

    } catch (error) {
      toast.error(error.message)
    }

  }

  const toggleSection = (index) => {
    // console.log(index)
    setOpenSection((pre) => (
      {
        ...pre,
        [index]: !pre[index]
      }
    ))
  }


  const enrollCourse = async ()=>{
      try {
        if(!userData){
          return toast.warn("Login to Enroll")
        }

        if(isEnrolled){
          return toast.warn("You already Enroll on this course")
        }

         const token = await getToken()
         const {data} = await axios.post(backendUrl+'/api/user/purchase', {courseId: courseData._id}, {headers:{Authorization:`Bearer ${token}`}})

         
         if(data.success){
          const {session_url} = data
         
          window.location.replace(session_url);
         }else{
          toast.error(data.message)
         }
        } catch (error) {
          toast.error(error.message)
        
      }
  }

  useEffect(() => {
    fechCourseData();
  }, []);

  useEffect(() => {

    if(userData && courseData){
       setIsEnrolled(userData.enrolledCourses.includes(courseData._id))
    }
  }, [userData, courseData]);

  return (

    courseData ?
      <>
        <div className='flex md:flex-row  flex-col-reverse gap-10 relative  item-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left bg-gradient-to-b from-cyan-100/70'>
          <div className='absolute top-0 left-0 w-full h-[500px] -z-1  bg-gradient-to-b from-cyan-100/70'></div>
          {/* left col */}
          <div className='max-w-xl z-10 text-gray-500'>
            <h1 className='md:text-4x md:li  text-3xl font-semibold to-gray-800'>{courseData.courseTitle}</h1>
            <p dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }} className=''></p>

            {/* review and ratting */}
            <div className='flex items-center flex-wrap space-x-2 pt-3 text-sm pb-1'>
              <p>{calculateRating(courseData)}</p>
              <div className='flex'>
                {[...Array(5)].map((_, i) => (<img key={i} src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} alt="star" className='w-3.5 h-3.5' />))}
              </div>
              <p className='text-blue-500'>{courseData.courseRatings.length}{courseData.courseRatings.length > 1 ? ' ratings,' : ' rating,'}</p>
              <p>{courseData.enrolledStudents.length}{courseData.enrolledStudents.length > 1 ? '  students,' : ' student,'}</p>
              <p>Course by <span className='text-blue-600 underline'>{courseData.educator.name}</span></p>


            </div>
            <div className='pt-8 text-gray-800'>
              <h2 className='text-xl font-semibold'>Course Structure</h2> 
              <div className='pt-5'>
                {courseData.courseContent.map((chapter, i) => (
                  <div key={i} className='border border-gray-300 bg-white mb-2 rounded'>
                    <div className='flex items-center justify-between px-4 py-3 cursor-pointer select-none' onClick={() => toggleSection(i)}>
                      <div className='flex items-center gap-2'>
                        <img className={`transform transition-transform ${openSection[i] ? 'rotate-180' : ''}`} src={assets.down_arrow_icon} alt="arrow-icon" />
                        <p className=' font-medium md:text-default'>{chapter.chapterTitle}</p>
                      </div>
                      <p>{chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}</p>
                    </div>
                    <div className={` overflow-hidden transition-all duration-300  ${openSection[i] ? 'max-h-96' : 'max-h-0'}`}>
                      <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                        {
                          chapter.chapterContent.map((lecture, i) => (
                            <li key={i} className='flex items-start gap-2 py-1'>
                              <img src={assets.play_icon} alt="play" className='w-4 h-4 mt-1' />
                              <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                                <p>{lecture.lectureTitle}</p>
                                <div className='flex gap-2'>
                                  {lecture.isPreviewFree && <p 
                                  onClick={()=>setPlayerData({
                                    videoId: lecture.lectureUrl.split('/').pop()
                                  })}
                                  className='text-blue-500 cursor-pointer'>Preview</p>}
                                  <p>{humanizeDuration(lecture.lectureDuration * 60 * 10000, { units: ['h', 'm'] })}</p>
                                </div>
                              </div>
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className='sm:text-xl text-sm md:text-default'>Course Description</h3>
              <p dangerouslySetInnerHTML={{ __html: courseData.courseDescription }} className='pt-3 rich-text'></p>

            </div>
          </div>

          {/* right col */}
          <div className=' h-min max-w-[424] z-10 shadow-course-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420]'>
          { playerData ?
                <YouTube videoId={playerData.videoId} opts={{playerVars:{autoplay:1}}} iframeClassName='w-full aspect-video'/>
               :   <img src={courseData.courseThumbnail} alt="thumbnail" />
                }
         
            <div className='p-5'>
              <div className='flex items-center gap-2'>
          
               <img src={assets.time_left_clock_icon} alt="time lci" />
                
                <p className='text-red-500'><span className='font-medium'>5 days</span> left at this price!</p>
              </div>
              <div className='flex items-center gap-2 '>
                <p className='text-2xl md:text-4xl  font-semibold text-gray-800'>{currency } {(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}</p>
                <p className='md:text-lg text-gray-500 line-through'>{currency} {courseData.coursePrice}</p>
                <p className='md:text-lg text-gray-500 '>{currency} {courseData.discount}% off</p>
              </div>
              <div className='flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500'>
                  <div className='flex items-center gap-2'>
                     <img src={assets.star} alt="" />
                     <p>{calculateRating(courseData)}</p>
                  </div>

                  <div className='h-4 w-px bg-gray-500/40'></div>
                  <div className='flex items-center gap-1'>
                     <img src={assets.time_clock_icon} alt="clock" />
                     <p>{calculateCourseDuration(courseData)}</p>
                  </div>
                  <div className='h-4 w-px bg-gray-500/40'></div>
                  <div className='flex items-center gap-1'>
                  <img src={assets.lesson_icon} alt="lesson" />
                  <p>{calculateNoOfLecture(courseData)}</p>
                  </div>
              </div>
              <button onClick={enrollCourse}
              className='md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium' 
              >{isEnrolled? 'Already Endrolled' : 'Enroll Now'}</button>

              <div className='pt-6'>
                <p>What's in the course</p>
                <ul className='ml-4 pt-2 text-sm md:text-default list-disc text-gray-600'>
                   <li>Lifetime access with free updates.</li>
                   <li>Step-by-step, hands-on project guidance.</li>
                   <li>Downloadable resources and source code.</li>
                   <li>Quizzes to test your knowledge.</li>
                   <li>Certificate of completion.</li>
                   <li>Quizzes to test your knowledge.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </>
      : <Loading />

  )
}

export default CourseDetails