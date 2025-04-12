import Course from "../models/Course.js";
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

        res.json({ success: false, user });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


// Get Users Enrolled Courses with lecture link
export const userEndrolledCourse = async (req, res) => {

    try {
        const userId = req.auth.userId;
        const userData = await User.findById(userId).populate('enrolledCourses');
        res.json({ success: true, endrolledCourses: userData.enrolledCourses });
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
            success_url: `${origin}/loading/my-endrollments`,
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