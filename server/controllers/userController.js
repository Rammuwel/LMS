import Course from "../models/Course.js";
import { CourseProgress } from "../models/CourseProgress.js";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";
import Stripe from 'stripe';



export const getUserData = async (req, res) => {
    try {
        const userId = req.auth.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User Not Found' });
        }

        res.json({ success: true, user });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


// Get Users Enrolled Courses with lecture link
export const userEndrolledCourse = async (req, res) => {

    try {
        const userId = req.auth.userId;
        const userData = await User.findById(userId).populate('enrolledCourses');
        res.json({ success: true, enrolledCourses: userData.enrolledCourses });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


// purchase course 
export const purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const { origin } = req.headers;

        const userId = req.auth.userId;

        const userData = await User.findById(userId);
        const courseData = await Course.findById(courseId);

        if (!userData || !courseData) {
            return res.json({ success: false, message: 'Data Not Fount' })
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2),
        }

        const newPurchase = await Purchase.create(purchaseData);

        // Stripe Payment Gateway Initialize
        const stripeInstance = new Stripe(process.env.STRIPE_SECRETE_KEY);
        const currency = process.env.CURRENCY.toLowerCase();


        //creating line item to for stripe
        const line_items = [
            {
                price_data: {
                    currency,
                    product_data: {
                        name: courseData.courseTitle
                    },
                    unit_amount: Math.floor(newPurchase.amount) * 100

                },
                quantity: 1
            }
        ];

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            metadata: {

                PurchaseId: newPurchase._id.toString()

            }

        })

        res.json({ success: true, session_url: session.url })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}



// update user course progress

export const updateUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { courseId, lectureId } = req.body

        const progressData = await CourseProgress.findOne({ userId, courseId });

        if (progressData) {
            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.json({ success: true, message: 'Lecture Already Completed' });

            }

            progressData.lectureCompleted.push(lectureId);
            await progressData.save();

        } else {
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            })
        }

        res.json({ success: true, message: 'Progress Updated' });


    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}




// Get User course progress

export const getUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { courseId } = req.body

        const progressData = await CourseProgress.findOne({ userId, courseId });
        res.json({ success: false, progressData });

    } catch (error) {
        res.json({ success: false, message: error.message });

    }
}


//Add User Ratting to course

export const addUserRating = async (req, res) => {

    const userId = req.auth.userId;
    const { courseId, rating } = req.body;

    if (!courseId || !userId || !ratin || rating < 1 || rating > 5) {
        return res.json({ success: false, message: 'Invalid details' });
    }


    try {
        const course = await Course.findById(courseId);

        if (!course) {
            return res.json({ success: false, message: 'Course Not Found' });
        }

        const user = await User.findById(userId);

        if (!user || !user.enrolledCourses.includes(courseId)) {
            return res.json({ success: false, message: 'User has not Purchase the course' });

        }


        const existingRatingIndex = course.courseRattings.findIndex(r => r.userId === userId);

        if (existingRatingIndex > -1) {
            course.courseRattings[existingRatingIndex].rating = rating;
        } else {
            course.courseRattings.push({ userId, rating });

            await course.save();

            return res.json({ success: true, message: 'Rating Added' });
        }

    } catch (error) {
        return res.json({ success: false, message: error.message });

    }
}