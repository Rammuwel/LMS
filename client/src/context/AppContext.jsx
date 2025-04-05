import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import humanizeDuration from 'humanize-duration'



export const AppContext = createContext();

export const AppContextProvider = ((props)=>{
    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(true)
    const [enrolledCourses, setEnrolledCourses] = useState([])


    const currency = import.meta.env.VITE_CURRENCY

    const fetchAllCourses = async ()=>{
        setAllCourses(dummyCourses)
    
    }

    //function for average ratting
    const calculateRating = (course)=>{
        if(course.courseRatings.length === 0){
            return 0;
        }

        let totalRating = 0

        course.courseRatings.forEach(ratingInfo=>{
            
            totalRating += +ratingInfo.rating
            
        })

        return totalRating/course.courseRatings.length
    }

    // function to calculate course time
    const calculateChapterTime = (chapter)=>{
        let time = 0;
        // console.log(chapter)
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration )
        return humanizeDuration(time * 60 * 1000, {units: ['h', 'm']})
    }

    //function to calculateCourseDuration

    const calculateCourseDuration = (course)=>{
        let time = 0

        course.courseContent.map((chapter)=>chapter.chapterContent.map((lecture)=>time += lecture.lectureDuration))
        return humanizeDuration(time * 60 * 100, {units: ['h', 'm']})
    }

     //function to calculate no of lecture
      const calculateNoOfLecture = (course)=>{
        let totalLectures = 0;
        // console.log(course.courseContent)
        course.courseContent.forEach(chapter=>{
            if(Array.isArray(chapter.chapterContent)){
                totalLectures += chapter.chapterContent.length 
               
            }
        
        });
  
        return totalLectures;
      }


    //  Fetch User Enrolled course
    const fetchUserEnrolledCourses = async ()=>{
        setEnrolledCourses(dummyCourses);    
    }



    useEffect(()=>{
        fetchAllCourses()
        fetchUserEnrolledCourses()
    },[])
    const value = {
       currency,
       allCourses,
       calculateRating,
       isEducator,
       setIsEducator,
       calculateChapterTime,
       calculateCourseDuration,
       calculateNoOfLecture,
       enrolledCourses
    };
    return <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
});
