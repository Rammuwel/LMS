import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SearchBar from '../../components/student/SearchBar';
import { AppContext } from '../../context/AppContext';
import CourseCard from '../../components/student/CourseCard';
import { assets } from '../../assets/assets';
import Footer from '../../components/student/Footer';


function CoursesList() {
  const [filterCourseList, setFilterCourseList] = useState([])
  const navigate = useNavigate();
  const { input } = useParams();
  const { allCourses } = useContext(AppContext);

   
  useEffect(()=>{
    if(allCourses && allCourses.length>0){
      const tempCourses = allCourses.slice();
      input ? 
      setFilterCourseList(
        tempCourses.filter(item=>item.courseTitle.toLowerCase().includes(input.toLocaleLowerCase()))
      )
      :setFilterCourseList(tempCourses)
    }
  }, [allCourses, input]);


  return (
    <>
    <div className='relative md:px-36 px-8 pt-20 text-left'>
      <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full '>
        <div>
          <h1 className='text-4xl font-semibold text-gray-800'>Course List</h1>
          <p><span onClick={() => { navigate('/') }} className='text-blue-600 cursor-pointer'> Home</span> / <span className='text-gray-500'>Course List</span></p>
        </div>
        <SearchBar data={input} />
      </div>
        {
          input && 
          <div className='inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-600'>
             <p>{input}</p>
             <img src={assets.cross_icon} alt="remove" onClick={()=>{navigate('/course-list')}} className='cursor-pointer' />
          </div>
        }
      <div className='grid grid-cols-1 sm:grid-cols-2 px-4 md:px-0 md:grid-cols-3 md:my-16 my-10 gap-4 lg:grid-cols-4 md:p-0'>
        {filterCourseList.map((course, i) => <CourseCard key={i} course={course} />)}
      </div>
   
    </div>
    <Footer/>
    </>
  )
}

export default CoursesList