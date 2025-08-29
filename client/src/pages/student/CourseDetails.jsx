import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { useParams, useNavigate } from 'react-router-dom'
import Loading from '../../components/student/Loading'
import { assets } from '../../assets/assets'
import humanizeDuration from 'humanize-duration'
import YouTube from 'react-youtube'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useUser } from '@clerk/clerk-react'

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination } from 'swiper/modules'

const CourseDetails = () => {
  const { id } = useParams()

  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)
  const [playerData, setPlayerData] = useState(null)

  const [reviews, setReviews] = useState([])
  const [newReview, setNewReview] = useState("")

 

  const {
    allCourses,
    calculateRating,
    calculateNoOfLectures,
    calculateCourseDuration,
    calculateChapterTime,
    currency,
    backendUrl,
    fetchAllCourses,
    userData,
    getToken,
  } = useContext(AppContext)



   

   console.log(userData)
  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/${id}`)
      
      if (data.success) {
        setCourseData(data.courseData)
      } else {
        toast.error(data.message || 'Failed to fetch course data')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch course data')
    }
  }

    
  const enrollCourse = async () => {
    try {
      if (!userData) {
        return toast.error('Please login to enroll in the course')
      }
      if (isAlreadyEnrolled) {
        return toast.warn('You are already enrolled in this course')
      }
      const token = await getToken()
      const { data } = await axios.post(
        backendUrl + '/api/user/purchase',
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        const { session_url } = data
        window.location.replace(session_url)
      } else {
        toast.error(data.message || 'Failed to enroll in the course')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to enroll in the course')
    }
  }

  const fetchReviews = async () => {
    try {
      const courseId = courseData?._id
      if (!courseId) return
      const response = await axios.get(`${backendUrl}/api/educator/get-review/${courseId}`)
      if (response.data.success) {
        // Reverse the reviews array to show latest reviews first (left to right)
        setReviews(response.data.reviews.reverse())
      } else {
        setReviews([])
      }
      
    } catch (err) {
      // Suppress error messages for null/undefined courseData
      if (err.message && !err.message.includes('Cannot read properties of null')) {
        toast.error(err.message || 'Failed to load reviews')
      }
      setReviews([])
    }
  }

  const postReview = async () => {
    if (!userData) return toast.error("Please login to post a review")
    if (!newReview.trim()) return toast.error("Review cannot be empty")
    
    try {
      const educatorId = courseData?.educator?._id
      const courseId = courseData?._id
      if (!educatorId || !courseId) return toast.error("Course information not available")
      
      const userName = userData.name
      const response = await axios.post(`${backendUrl}/api/educator/post-review`, {
        newReview,
        educatorId,
        courseId,
        userName
      })
      
      if (response.data.success) {
        toast.success("Review posted successfully!")
        setNewReview("")
        fetchReviews() // Refresh reviews after posting
      } else {
        toast.error(response.data.message || "Failed to post review")
      }
    } catch(error) {
      // Suppress error messages for null/undefined courseData
      if (error.message && !error.message.includes('Cannot read properties of null')) {
        toast.error(error.response?.data?.message || "Failed to post review")
      }
      console.log(error)
    }
  }

  useEffect(() => {
    fetchCourseData()
    fetchReviews()
  }, [])

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id))
    }
  }, [userData, courseData])

  useEffect(() => {
    if (courseData) fetchReviews()
  }, [courseData])

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  return courseData ? (
    <>
      <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left'>
        {/*left*/}
        <div className='absolute top-0 left-0 w-full h-section-height -z-10 bg-gradient-to-b from-cyan-100/70'></div>
        <div className='max-w-xl z-10 text-gray-500'>
          <h1 className='md:text-course-deatails-heading-large text-course-deatails-heading-small font-semibold text-gray-800'>{courseData.courseTitle}</h1>
          <p className='pt-4 md:text-base text-sm'
            dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }}></p>

          {/*review and rating*/}
          <div className='flex items-center space-x-2 pt-3 pb-1 text-sm'>
            <p>{calculateRating(courseData)}</p>
            <div className='flex'>
              {[...Array(5)].map((_, i) => (<img key={i} src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} alt=''
                className='w-3.5 h-3.5' />))}
            </div>
            <p className='text-blue-500'>({courseData.courseRatings.length} {courseData.courseRatings.length > 1 ? 'ratings' : 'rating'})</p>
            <p>{courseData.enrolledStudents.length} {courseData.enrolledStudents.length > 1 ? 'students' : 'student'}</p>
          </div>
          <p className='text-sm'>Course by <span className='text-blue-600 underline'>{courseData.educator?.name || 'Unknown Educator'}</span></p>
          <div className='pt-8 text-gray-800'>
            <h2 className='text-xl font-semibold'>Course Structure</h2>
            <div className='pt-5'>
              {courseData.courseContent.map((chapter, index) => (
                <div key={index} className='border border-gray-300 bg-white mb-2 rounded'>
                  <div className='flex items-center justify-between p-4 py-3 cursor-pointer select-none' onClick={() => toggleSection(index)}>
                    <div className='flex items-center gap-2'>
                      <img className={`transform transition ${openSections[index]
                        ? 'rotate-180' : ''}`} src={assets.down_arrow_icon} alt="arrow icon" />
                      <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                    </div>
                    <p className='text-sm md:text-default'>{chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}</p>
                  </div>
                  <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? 'max-h-96' : 'max-h-0'}`}>
                    <ul className='list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300'>
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className='flex items-start gap-2 py-1'><img src={assets.play_icon} alt="play_icon" className='w-4 h-4 mt-1' />
                          <div className='flex items-center justify-between w-full text-gray-800 text-xs md:text-default'>
                            <p>{lecture.lectureTitle}</p>
                            <div className='flex gap-2'>
                              {lecture.isPreviewFree && <p className='text-blue-500 cursor-pointer'
                                onClick={() => setPlayerData({ videoId: lecture.lectureUrl.split('/').pop() })}>Preview</p>}
                              <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='py-20 text-sm md:text-default'>
            <h3 className='text-xl font-semibold text-gray-800'>Course Description</h3>
            <p className='pt-3 rich-text'
              dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}></p>
          </div>
        </div>

        {/*right*/}
        <div className='max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]'>
          {
            playerData ?
              <YouTube videoId={playerData.videoId} opts={{ playerVars: { autoplay: 1 } }} iframeClassName='w-full aspect-video' />
              :
              <img src={courseData.courseThumbnail} alt="" />
          }

          <div className='p-5'>
            <div className='flex items-center gap-2'>
              <img className='w-3.5' src={assets.time_left_clock_icon} alt="time left clock icon" />
              <p className='text-red-500'><span className='font-medium'>5 days</span> left at this price!</p>
            </div>
            <div className='flex gap-3 items-center pt-2'>
              <p className='text-grey-800 md:text-4xl text-2xl font-semibold'>{currency}{(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}</p>
              <p className='md:text-lg text-gray-500 line-through'>{currency}{courseData.coursePrice}</p>
              <p className='md:text-lg text-gray-500'>{courseData.discount}% off!!</p>
            </div>
            <div className='flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500'>
              <div className='flex items-center gap-1'>
                <img src={assets.star} alt="star icon" />
                <p>{calculateRating(courseData)}</p>
              </div>
              <div className='h-4 w-px bg-gray-500/40'></div>
              <div className='flex items-center gap-1'>
                <img src={assets.time_clock_icon} alt="clock icon" />
                <p>{calculateCourseDuration(courseData)}</p>
              </div>
              <div className='h-4 w-px bg-gray-500/40'></div>
              <div className='flex items-center gap-1'>
                <img src={assets.lesson_icon} alt="clock icon" />
                <p>{calculateNoOfLectures(courseData)} lessons</p>
              </div>
            </div>
            <button onClick={enrollCourse} className='md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium'>{isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}</button>
            <div className='pt-6'>
              <p className='md:text-xl text-lg font-medium text-gray-800'>What's in the course?</p>
              <ul className='ml-4 pt-2 text-sm md:text-default list-disc text-gray-500'>
                <li>Lifetime access.</li>
                <li>Step-by-step guide.</li>
                <li>Downloadable lectures.</li>
                <li>Attempt quiz to test your knowledge.</li>
                <li>Certificate of completion.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="md:px-36 px-8 py-16">
        <h2 className="text-2xl font-semibold text-gray-800">Student Reviews</h2>

        {/* Textarea + Button */}
        <div className="mt-6 flex flex-col gap-3">
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="4"
          ></textarea>
          <button
            onClick={postReview}
            className="self-end px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Post Review
          </button>
        </div>

       
{/* Reviews Slider */}
<div className="mt-10 relative">
  <Swiper
    modules={[Navigation, Pagination]}
    navigation={{
      nextEl: ".custom-next",
      prevEl: ".custom-prev",
    }}
    pagination={{ clickable: true }}
    spaceBetween={30}
    slidesPerView={1}
    autoplay={{ delay: 3000, disableOnInteraction: false }}
    breakpoints={{
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    }}
    className="pb-12"
  >
    {reviews.length > 0 ? (
      reviews.map((review, index) => (
        <SwiperSlide key={index}>
          <div className="p-6 bg-white rounded-2xl  border border-gray-100  transition-all duration-300">
            <p className="text-gray-700 text-sm leading-relaxed">
              “{review.review}”
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                {review.userName ? review.userName[0] : "A"}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {review.userName || "Anonymous"}
                </p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))
    ) : (
      <p className="text-gray-500 mt-4">No reviews yet. Be the first to review!</p>
    )}
  </Swiper>

  {/* Custom Navigation Buttons */}
  <button className="custom-prev absolute -left-6 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full shadow hover:bg-blue-700 transition">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
  <button className="custom-next absolute -right-6 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full shadow hover:bg-blue-700 transition">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  </button>
</div>


      </div>
    </>
  ) : <Loading />
}

export default CourseDetails

