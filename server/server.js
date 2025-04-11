import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/conn.js'
import { clerkWebhooks, stripeWebhooks } from './controllers/webHook.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './config/cloudinary.js'
import courseRouter from './routes/courseRoute.js'
import userRouter from './routes/userRoutes.js'


//initialize express
const app = express();


//connect to database 
await connectDB();
await connectCloudinary();


//middleware 
app.use(cors());
app.use(clerkMiddleware());

//routes
app.get('/', (req, res)=>res.send("hellow jee kaise ho app"));
app.post('/clerk', express.json(), clerkWebhooks);
app.use('/api/educatore', express.json(), educatorRouter);
app.use('/api/course', express.json(), courseRouter);
app.use('/api/user', express.json(), userRouter);
app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks)

//Port 
const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})