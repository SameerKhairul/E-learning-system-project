import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import { useParams } from 'react-router-dom'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import YouTube from 'react-youtube'
import Footer from '../../components/student/Footer'
import Rating from '../../components/student/Rating'
import { toast } from 'react-toastify'
import Loading from '../../components/student/Loading'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Player = () => {

const {enrolledCourses, calculateChapterTime, backendUrl, getToken, userData, fetchUserEnrolledCourses} = useContext(AppContext)
const {courseId} = useParams()

const [materials, setMaterials] = useState(null)
const [courseData, setCourseData] = useState(null)
const [openSections, setOpenSections] = useState({})
const [playerData, setPlayerData] = useState(null)
const [progressData, setProgressData] = useState(null)
const [initialRating, setInitialRating] = useState(0)

const getCourseData = ()=> {
  
  enrolledCourses.map((course)=>{
    if(course._id === courseId){
      setCourseData(course)
      course.courseRatings.map((item) => {
        if(item.userId === userData._id){
          setInitialRating(item.rating)
        }
        setInitialRating(item.rating)
      })
    }
  })
}
const getMaterials = async () => {
  try {
    const token = await getToken();
    const { data } = await axios.get(`${backendUrl}/api/course/materials/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("materials", data);
    if (data.success) {
      setMaterials(data.materials[0].fileUrl);
      console.log("materials data file", data.materials[0].fileUrl);
    } else {
      toast.error(data.message || 'no materials to fetch');
    }
  } catch (error) {
    toast.error(error.message || 'Failed to fetch materials');
  }
};
const toggleSection = (index) => {
    setOpenSections((prev) => (
      {...prev,[index]: !prev[index]}
    ));
}

useEffect(() => {
  getMaterials();
  console.log("materials", materials);
}, [courseId]);

useEffect(()=>{
  if(enrolledCourses.length > 0){
    getCourseData()
  }
}, [enrolledCourses])

const markLectureAsCompleted = async (lectureId) => {
  try {
    const token = await getToken();
    const {data} = await axios.post(`${backendUrl}/api/user/update-course-progress`, {courseId, lectureId},{headers: {Authorization: `Bearer ${token}`}})
    if (data.success) {
      toast.success(data.message)
      // Update progress data immediately to prevent crash
      setProgressData(prevData => {
        if (!prevData) {
          return { lectureCompleted: [lectureId] }
        }
        if (!prevData.lectureCompleted) {
          return { ...prevData, lectureCompleted: [lectureId] }
        }
        if (!prevData.lectureCompleted.includes(lectureId)) {
          return { ...prevData, lectureCompleted: [...prevData.lectureCompleted, lectureId] }
        }
        return prevData
      })
      // Also refresh from server
      getCourseProgress()
    } else {
      toast.error(data.message || 'Failed to mark lecture as completed')
    }
  
  } catch (error) {
    console.error('Error marking lecture as completed:', error)
    toast.error(error.response?.data?.message || error.message || 'Failed to mark lecture as completed')
  }
}

const getCourseProgress = async () => {
  try {
    const token = await getToken();
    const {data} = await axios.post(`${backendUrl}/api/user/get-course-progress`, {courseId}, {headers: {Authorization: `Bearer ${token}`}})
    if (data.success) {
      console.log('Progress data:', data.progressData)
      // Ensure progressData has the correct structure
      const progressData = data.progressData || { lectureCompleted: [] }
      if (!progressData.lectureCompleted) {
        progressData.lectureCompleted = []
      }
      setProgressData(progressData);
    } else {
      console.warn('Failed to fetch progress:', data.message)
      // Set empty progress data instead of null to prevent crashes
      setProgressData({ lectureCompleted: [] })
    }
  } catch (error) {
    console.error('Error fetching course progress:', error)
    // Set empty progress data instead of null to prevent crashes
    setProgressData({ lectureCompleted: [] })
    toast.error(error.response?.data?.message || error.message || 'Failed to fetch course progress')
  }
}

  const handleRate = async (rating) => {
    try {
      const token = await getToken();
      const {data} = await axios.post(`${backendUrl}/api/user/add-rating`, {courseId, rating}, {headers: {Authorization: `Bearer ${token}`}})
      if (data.success) {
        toast.success(data.message)
        fetchUserEnrolledCourses();
      } else {
        toast.error(data.message || 'Failed to add rating')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to add rating')
    }
  }

  useEffect(() => {
    getCourseProgress();
  },[])

  return courseData ? (
    <>
      <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36'>
      {/*left*/}
      <div className='text-gray-800'>
      <h2 className='text-xl font-semibold'>Course Structure</h2>

      <div className='pt-5'>
                {courseData && courseData.courseContent.map((chapter, index)=> (
                  <div key={index} className='border border-gray-300 bg-white mb-2 rounded'>
                    <div className='flex items-center justify-between p-4 py-3 cursor-pointer select-none' onClick={()=> toggleSection(index)}>
                      <div className='flex items-center gap-2'>
                        <img className={`transform transition ${openSections [index]
                            ? 'rotate-180' : ''}`} src={assets.down_arrow_icon} alt="arrow icon" />
                        <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                      </div>
                      <p className='text-sm md:text-default'>{chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}</p>
                    </div>
                    <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}>
                      <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                        {chapter.chapterContent.map((lecture,i)=> (
                          <li key={i} className='flex items-start gap-2 py-1'>

                            <img src={progressData && progressData.lectureCompleted && progressData.lectureCompleted.includes(lecture.lectureId) ? assets.blue_tick_icon : assets.play_icon} 
                          alt="play_icon" className='w-4 h-4 mt-1' />
                          <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                            <p>{lecture.lectureTitle}</p>
                            <div className='flex gap-2'>
                            {lecture.lectureUrl && <p className='text-blue-500 cursor-pointer' 
                            onClick={() => setPlayerData({
                              ...lecture, chapter: index+1, lecture: i+1
                            })}>Watch</p>}
                            <p>{humanizeDuration(lecture.lectureDuration*60*1000,{units: ['h','m']})}</p>
                            </div>
                            </div>
                            </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              {materials && (
              <div className="mt-6">
              <h2 className="text-lg font-semibold">Course Materials</h2>
              <a href={materials} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                Download PDF
              </a>
              </div>
              )}
              <div className='flex items-center gap-2 py-3 mt-10'>
                <h1 className='text-xl font-bold'>Rate this Course:</h1>
                <Rating initialRating={initialRating} onRate={handleRate}/>
              </div>
            <div className='mt-4'>
              <Link to={`/leaderboard/${courseId}`}>
                <button className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition'>
                View Leaderboard
                </button>
              </Link>
            </div>

        </div>
      
      {/*right*/}
      <div className='md:mt-10'>
        {playerData ? (
          <div>
            <YouTube videoId={playerData.lectureUrl.split('/').pop()} iframeClassName='w-full aspect-video'/>
          <div className='flex justify-between items-center mt-1'>
            <p>{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}</p>
            <button onClick={()=> markLectureAsCompleted(playerData.lectureId)} className='text-blue-600'>
              {progressData && progressData.lectureCompleted && progressData.lectureCompleted.includes(playerData.lectureId) ? 'Completed' : 'Mark Complete'}
              </button>
          </div>
          </div>
        )
        :
        <img src={courseData ? courseData.courseThumbnail : ''} alt="thumbnail" />
          }
      </div>
    </div>
    </>
  ) : <Loading />
}

export default Player
