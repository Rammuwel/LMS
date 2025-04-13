import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import humanizeDuration from 'humanize-duration'
import { useAuth, useUser } from '@clerk/clerk-react'
import axios from 'axios';
import { toast } from "react-toastify";


export const AppContext = createContext();

export const AppContextProvider = ((props) => {
    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(false)
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [userData, setUserData] = useState(null)


    const currency = import.meta.env.VITE_CURRENCY
    const { getToken } = useAuth()
    const { user } = useUser()
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const fetchAllCourses = async () => {
        // setAllCourses(dummyCourses)
       
       
        try {
            const { data } = await axios.get(backendUrl + '/api/course/all');

            if (data.success) {
                setAllCourses(data.courses)
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }

    }


    //fetch user data
    const fetchUserData = async () => {

        if (user.publicMetadata.role === 'educator') {
            setIsEducator(true);
        }

        try {
            const token = await getToken();

            const { data } = await axios.get(backendUrl + '/api/user/data', {
                headers:
                    { Authorization: `Bearer ${token}` }
            })
         
            
            if (data.success) {
                
                setUserData(data.user);
               
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    //function for average ratting
    const calculateRating = (course) => {

        if (course.courseRatings.length === 0) {
            return 0;
        }

        let totalRating = 0

        course.courseRatings.forEach(ratingInfo => {

            totalRating += +ratingInfo.rating

        })

        return Math.floor(totalRating / course.courseRatings.length)
    }

    // function to calculate course time
    const calculateChapterTime = (chapter) => {
        let time = 0;
        // console.log(chapter)
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] })
    }

    //function to calculateCourseDuration

    const calculateCourseDuration = (course) => {
        let time = 0

        course.courseContent.map((chapter) => chapter.chapterContent.map((lecture) => time += lecture.lectureDuration))
        return humanizeDuration(time * 60 * 100, { units: ['h', 'm'] })
    }

    //function to calculate no of lecture
    const calculateNoOfLecture = (course) => {
        let totalLectures = 0;
        // console.log(course.courseContent)
        course.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length

            }

        });

        return totalLectures;
    }


    //  Fetch User Enrolled course
    const fetchUserEnrolledCourses = async () => {
        // setEnrolledCourses(dummyCourses); 
        try {
            const token = await getToken();

            const {data} = await axios.get(backendUrl + '/api/user/enrolled-courses', {
                headers: { Authorization: `Bearer ${token}` }
            })
            // console.log(data)

            if (data.success) {
                setEnrolledCourses(data.enrolledCourses.reverse());
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)

        }



    }



    useEffect(() => {
        fetchAllCourses()
     
    }, [])



    useEffect(() => {
        if (user) {
            fetchUserData()
            fetchUserEnrolledCourses()
        }
    }, [user])

    const value = {
        currency,
        allCourses,
        calculateRating,
        isEducator,
        setIsEducator,
        calculateChapterTime,
        calculateCourseDuration,
        calculateNoOfLecture,
        enrolledCourses,
        backendUrl,
        userData,
        setUserData,
        getToken,
        fetchAllCourses,
        fetchUserEnrolledCourses


    };
    return <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
});
