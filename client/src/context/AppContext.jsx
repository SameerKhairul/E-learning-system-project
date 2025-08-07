import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser} from "@clerk/clerk-react"
import axios from "axios";
import { toast } from 'react-toastify';

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const currency = import.meta.env.VITE_CURRENCY

    const navigate = useNavigate()

    const {getToken} = useAuth()
    const {user} = useUser()

    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(false)
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [userData, setUserData] = useState(null)

    //Fetch all courses from the server
    const fetchAllCourses = async () => {
        try {
            console.log('Fetching all courses from:', backendUrl + '/api/courses/all');
            const {data} = await axios.get(backendUrl + '/api/course/all')
            console.log('Resoponse',data);
            if(data.success) {
                setAllCourses(data.courses)
            } else {
                toast.error(data.message || 'Failed to fetch courses')
            }
        } catch (error) {
            toast.error(data.message)
        }
    }

    //fetch user data

    const fetchUserData = async () => {

        if (user.publicMetadata.role === 'educator') {
            setIsEducator(true)
        }

        try {
            const token = await getToken();
            console.log('Fetching user data with token:', token);
            const {data} = await axios.get(backendUrl + '/api/user/data', {headers: {Authorization: `Bearer ${token}`}})
            
            console.log('User Data:', data);
            
            if (data.success) {
                setUserData(data.user)
            } else {
                toast.error(data.message || 'Failed to fetch user data')
            }
        } catch (error) {
            toast.error(error.message || 'Failed to fetch user data')
        }
    }

    //function to calc avg rating of courses
    const calculateRating = (course) => {
        if(course.courseRatings.length == 0) {
            return 0;
        }
        let totalRating = 0;
        course.courseRatings.forEach((rating) => {
            totalRating += rating.rating
        })
        return Math.floor(totalRating / course.courseRatings.length)
    }

    //calculate course chapter time

    const calculateChapterTime = (chapter)=>{
        let time = 0
        chapter.chapterContent.map((lecture=> time += lecture.lectureDuration))
        return humanizeDuration(time*60*1000, {units: ["h","m"]})
    }

    const calculateCourseDuration = (course) => {
        let time = 0
        course.courseContent.map((chapter)=> chapter.chapterContent.map((lecture)=> time += lecture.lectureDuration))
        return humanizeDuration(time*60*1000, {units: ["h","m"]})
    }

    //calc num of lec in course
    
    const calculateNoOfLectures = (course) => {
        let totalLectures = 0;
        course.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)){
                totalLectures += chapter.chapterContent.length;
            }
        })
        return totalLectures;
    }

    //Fetch enrolled courses
    const fetchUserEnrolledCourses = async ()=> {
        try {
        const token = await getToken();
        const { data } = await axios.get(backendUrl + '/api/user/enrolled-courses', {
            headers: {
                Authorization: `Bearer ${token}`
            }})

            if (data.success) {
                setEnrolledCourses(data.enrolledCourses.reverse())
            } else {
                toast.error(data.message || 'Failed to fetch enrolled courses')
            }

        } catch (error) {
            toast.error(error.message || 'Failed to fetch enrolled courses')
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
    },[user])

    const value = {
        currency,allCourses,navigate,calculateRating, isEducator,setIsEducator,calculateNoOfLectures,
        calculateCourseDuration,calculateChapterTime, enrolledCourses, fetchUserEnrolledCourses, backendUrl, setUserData, getToken,
        fetchAllCourses, userData, setEnrolledCourses, fetchUserData, isEducator, setIsEducator
        }

    return (
        <AppContext.Provider value = {value}>
            {props.children}
        </AppContext.Provider>
    )

}