import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

//ApI controller to manage Clerk user

export const clerkWebhooks = async (req,res) => {


    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]

        })

        const {data, type} = req.body

        switch (type) {
            case 'user.created': {
                // console.log('Clerk User Created Event Received:', data);
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                }
                await User.create(userData)
                res.json({})
                break;
            }
                
            case 'user.updated': {
                // console.log('Clerk User Created Event Received:', data);
                const userData = {
                    email: data.email_addresses[0].email_address,//POSSIBLE ISSUE WITH ADRESS VS ADRESSES
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                }
                await User.findByIdAndUpdate(data.id, userData)
                res.json({})
                break
            }

            case 'user.deleted': {
                // console.log('Clerk User Created Event Received:', data);
                await User.findByIdAndDelete(data.id)
                res.json({})
                break
            }            
            
   
            default:
                break;
        }
    } catch (error) {
        res.json({success: false, message: error.message})

    }
}

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebhooks = async(request,response) => {
    const sig = request.headers['stripe-signature'];
    let event;

    console.log('=== STRIPE WEBHOOK RECEIVED ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Headers:', JSON.stringify(request.headers, null, 2));
    console.log('Body length:', request.body?.length || 0);

    try {
        event = Stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        console.log('✅ Webhook signature verified');
        console.log('Event type:', event.type);
        console.log('Event ID:', event.id);
    } catch (err) {
        console.error('❌ Webhook signature verification failed:', err.message);
        console.error('STRIPE_WEBHOOK_SECRET exists:', !!process.env.STRIPE_WEBHOOK_SECRET);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed': {
            console.log('Processing checkout.session.completed event');
            const session = event.data.object;
            console.log('Session metadata:', session.metadata);
            
            try {
                const purchaseId = session.metadata.purchaseId;
                
                if (!purchaseId) {
                    console.error('No purchaseId found in session metadata');
                    return response.json({received: true});
                }

                console.log('Looking for purchase with ID:', purchaseId);

                const purchaseData = await Purchase.findById(purchaseId);
                if (!purchaseData) {
                    console.error('Purchase not found:', purchaseId);
                    return response.json({received: true});
                }

                console.log('Found purchase:', purchaseData);

                const userData = await User.findById(purchaseData.userId);
                const courseData = await Course.findById(purchaseData.courseId);

                if (!userData || !courseData) {
                    console.error('User or Course not found. User:', !!userData, 'Course:', !!courseData);
                    return response.json({received: true});
                }

                console.log('Found user and course. Enrolling...');

                // Add user ID to course's enrolled students (not the whole user object)
                if (!courseData.enrolledStudents.includes(userData._id)) {
                    courseData.enrolledStudents.push(userData._id);
                    await courseData.save();
                }
                
                // Add course ID to user's enrolled courses
                if (!userData.enrolledCourses.includes(courseData._id)) {
                    userData.enrolledCourses.push(courseData._id);
                    await userData.save();
                }

                purchaseData.status = 'completed';
                await purchaseData.save();

                console.log('Enrollment completed successfully!');

            } catch (error) {
                console.error('❌ Error processing checkout.session.completed:', error);
                console.error('Error stack:', error.stack);
                
                try {
                    const purchaseId = session.metadata?.purchaseId;
                    if (purchaseId) {
                        await Purchase.findByIdAndUpdate(purchaseId, { status: 'failed' });
                        console.log('Updated purchase status to failed due to processing error');
                    }
                } catch (updateError) {
                    console.error('Failed to update purchase status to failed:', updateError);
                }
            }
            break;
        }

        case 'payment_intent.succeeded': {
            console.log('PaymentIntent was successful!');
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            try {
                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId
                });
                
                if (!session.data.length) {
                    console.error('No session found for payment intent:', paymentIntentId);
                    return response.json({received: true});
                }

                const { purchaseId } = session.data[0].metadata;

                const purchaseData = await Purchase.findById(purchaseId);
                const userData = await User.findById(purchaseData.userId);
                console.log('User data:', userData);
                const courseData = await Course.findById(purchaseData.courseId.toString());

                // Add user ID to course's enrolled students (not the whole user object)
                if (!courseData.enrolledStudents.includes(userData._id)) {
                    courseData.enrolledStudents.push(userData._id);
                    await courseData.save();
                }
                
                // Add course ID to user's enrolled courses
                if (!userData.enrolledCourses.includes(courseData._id)) {
                    userData.enrolledCourses.push(courseData._id);
                    await userData.save();
                }

                purchaseData.status = 'completed';
                await purchaseData.save();

                console.log('PaymentIntent enrollment completed successfully!');

            } catch (error) {
                console.error('❌ Error processing payment_intent.succeeded:', error);
            }
            break;
        }

        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            try {
                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntentId
                });
                
                if (session.data.length) {
                    const { purchaseId } = session.data[0].metadata;
                    const purchaseData = await Purchase.findById(purchaseId);
                    purchaseData.status = 'failed';
                    await purchaseData.save();
                    console.log('Payment failed, updated purchase status');
                }

            } catch (error) {
                console.error('❌ Error processing payment_intent.payment_failed:', error);
            }
            break;
        }

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({received: true});
}