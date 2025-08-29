import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRoute.js'
import userRouter from './routes/userRoutes.js'
import markRouter from './routes/markRoute.js'

//initialize express
const app = express()

//cnct db
await connectDB()
await connectCloudinary()

//middleware
app.use(cors())
app.use(clerkMiddleware())

//routes
app.get('/', (req, res) => res.send('API Working'))
app.get('/stripe-test', (req, res) => {
    console.log('Stripe test endpoint hit');
    res.json({message: 'Stripe webhook endpoint is reachable', timestamp: new Date().toISOString()});
})

// Debug endpoint to check purchase status
app.get('/debug/purchases/:userId', express.json(), async (req, res) => {
    try {
        const { Purchase } = await import('./models/Purchase.js');
        const purchases = await Purchase.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json({ purchases });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

// Debug endpoint to check all purchases
app.get('/debug/all-purchases', express.json(), async (req, res) => {
    try {
        const { Purchase } = await import('./models/Purchase.js');
        const purchases = await Purchase.find({}).sort({ createdAt: -1 }).limit(20);
        const stats = {
            total: await Purchase.countDocuments(),
            pending: await Purchase.countDocuments({ status: 'pending' }),
            completed: await Purchase.countDocuments({ status: 'completed' }),
            failed: await Purchase.countDocuments({ status: 'failed' })
        };
        res.json({ purchases, stats });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
app.post('/clerk', express.json(), clerkWebhooks)
app.use('/api/educator',express.json(), educatorRouter)
app.use('/api/course', express.json(),courseRouter)
app.use('/api/user',express.json(),userRouter)
app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks)
app.use('/api/marks',express.json(),markRouter)
//port
const PORT = process.env.PORT || 5000

app.listen(PORT, ()=> {
    console.log(`Serving on port ${PORT}`)
})